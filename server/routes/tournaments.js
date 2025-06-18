import express from 'express';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import { sendTournamentNotification, sendTestEmail, testEmailConfig } from '../utils/emailService.js';
import { generateFixtures } from '../utils/fixtureGenerator.js';

const router = express.Router();

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    console.log('Starting email configuration test...');
    console.log('Environment variables check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      hasClientUrl: !!process.env.CLIENT_URL
    });

    // First test the configuration
    const configTest = await testEmailConfig();
    if (!configTest) {
      return res.status(500).json({ 
        message: 'Email configuration test failed',
        details: 'Check server logs for SMTP verification error'
      });
    }

    // Send test email directly to the specified address
    const testEmail = '173jaiminradia@gmail.com';
    console.log('Sending test email to:', testEmail);

    const emailSent = await sendTestEmail(testEmail);
    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send test email',
        details: 'Check server logs for SMTP send error'
      });
    }

    res.json({ 
      message: 'Test email sent successfully',
      to: testEmail
    });
  } catch (error) {
    console.error('Test email error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ 
      message: 'Error testing email configuration', 
      error: error.message,
      details: error.stack
    });
  }
});

// GET all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('participants')
      .populate('fixtures.player1')
      .populate('fixtures.player2')
      .populate('fixtures.winner');
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST new tournament
router.post('/', async (req, res) => {
  try {
    console.log('Creating new tournament with data:', req.body);
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'time', 'location'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Create tournament with default values for optional fields
    const tournamentData = {
      ...req.body,
      status: req.body.status || 'upcoming',
      maxParticipants: req.body.maxParticipants || 8,
      participants: [],
      fixtures: []
    };

    console.log('Creating tournament with data:', tournamentData);
    
    const tournament = new Tournament(tournamentData);
    await tournament.save();
    
    console.log('Tournament created successfully:', tournament);
    
    // Send notification to all users
    try {
      console.log('Fetching all users for notification...');
      const users = await User.find({}).select('email name'); // Only select email and name fields
      console.log(`Found ${users.length} users to notify`);
      
      if (users.length === 0) {
        console.log('No users found in database');
      } else {
        console.log('User emails:', users.map(u => u.email).join(', '));
      }

      const emailResults = await sendTournamentNotification(users, tournament);
      const successfulSends = emailResults.filter(result => result !== null).length;
      console.log(`Successfully sent ${successfulSends} out of ${users.length} emails`);
    } catch (emailError) {
      console.error('Error sending tournament notification:', {
        message: emailError.message,
        stack: emailError.stack,
        code: emailError.code
      });
      // Don't fail the request if email fails
    }
    
    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ 
      message: 'Failed to create tournament',
      error: error.message,
      details: error.errors // Include validation errors if any
    });
  }
});

// Register for a tournament
router.post('/:id/register', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    const user = await User.findById(req.body.userId);

    if (!tournament || !user) {
      return res.status(404).json({ message: 'Tournament or user not found' });
    }

    // Check if tournament is full
    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Check if user is already registered
    if (tournament.participants.includes(user._id)) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Add user to participants
    tournament.participants.push(user._id);

    // If tournament is full (8 participants), generate fixtures
    if (tournament.participants.length === 8) {
      tournament.fixtures = generateFixtures(tournament.participants);
    }

    await tournament.save();
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update tournament fixture result
router.patch('/:id/fixtures/:fixtureId', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    const fixture = tournament.fixtures.id(req.params.fixtureId);
    
    if (!fixture) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    // Update fixture result
    fixture.winner = req.body.winnerId;
    fixture.status = 'completed';

    // Update next round fixture if applicable
    if (fixture.round < 3) {
      const nextRoundFixture = tournament.fixtures.find(f => 
        f.round === fixture.round + 1 && 
        f.matchNumber === Math.ceil(fixture.matchNumber / 2)
      );

      if (nextRoundFixture) {
        if (!nextRoundFixture.player1) {
          nextRoundFixture.player1 = req.body.winnerId;
        } else {
          nextRoundFixture.player2 = req.body.winnerId;
        }
      }
    }

    await tournament.save();
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all users (for debugging)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Debug endpoint to test tournament notification
router.get('/debug/test-notification', async (req, res) => {
  try {
    console.log('Starting debug notification test...');
    
    // Create a test tournament
    const testTournament = {
      _id: 'test123',
      title: 'Test Tournament',
      description: 'This is a test tournament',
      date: new Date(),
      time: '14:00',
      location: 'Test Location',
      registrationFee: 100,
      prizePool: 1000
    };

    // Get all users
    console.log('Fetching all users...');
    const users = await User.find({}).select('email name');
    console.log(`Found ${users.length} users:`, users.map(u => u.email).join(', '));

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found in database' });
    }

    // Test email configuration
    console.log('Testing email configuration...');
    const configTest = await testEmailConfig();
    if (!configTest) {
      return res.status(500).json({ message: 'Email configuration test failed' });
    }

    // Send test notification
    console.log('Sending test notification...');
    const emailResults = await sendTournamentNotification(users, testTournament);
    const successfulSends = emailResults.filter(result => result !== null).length;

    res.json({
      message: 'Test notification sent',
      usersNotified: users.length,
      successfulSends,
      userEmails: users.map(u => u.email)
    });
  } catch (error) {
    console.error('Debug notification test error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      message: 'Error in debug notification test',
      error: error.message
    });
  }
});

export default router;
