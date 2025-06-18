import express from 'express';
import { createTournament, registerForTournament } from '../services/tournamentService.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Tournament from '../models/Tournament.js'; // Needed for fetching tournament details
import { testEmailConfig, sendTestEmail } from '../utils/emailService.js'; // ✅ Import these
import User from '../models/User.js';

const router = express.Router();

// Test email endpoint - Moved before tournament ID route
router.get('/test-email', async (req, res) => {
  try {
    // First test the configuration
    const configOk = await testEmailConfig();
    if (!configOk) {
      return res.status(500).json({ 
        message: 'Email configuration test failed',
        details: 'Please check if EMAIL_USER and EMAIL_PASSWORD are set in .env file'
      });
    }

    // Send test email
    const testEmail = '173jaiminradia@gmail.com'; // Using the email from your test user
    const sent = await sendTestEmail(testEmail);

    if (sent) {
      return res.status(200).json({ 
        message: 'Test email sent successfully',
        to: testEmail
      });
    } else {
      return res.status(500).json({ 
        message: 'Failed to send test email',
        details: 'Check server logs for more information'
      });
    }
  } catch (error) {
    console.error('Error in test-email endpoint:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Send test email to all users
router.get('/send-all-users', async (req, res) => {
  try {
    console.log('📧 Starting to send test emails to all users...');
    
    // Get all users from database
    const users = await User.find({}).select('email name');
    console.log(`Found ${users.length} users in database`);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'No users found in database',
        suggestion: 'Run addUsers.js script first to add test users'
      });
    }
    
    // Log all users that will receive emails
    console.log('👥 Users to email:', users.map(u => ({ email: u.email, name: u.name })));
    
    // Send test email to each user
    const emailPromises = users.map(async user => {
      if (!user.email) {
        console.log(`⚠️ Skipping user ${user._id} - no email address`);
        return null;
      }
      
      console.log(`📧 Sending test email to: ${user.email}`);
      const sent = await sendTestEmail(user.email);
      
      if (sent) {
        console.log(`✅ Email sent successfully to ${user.email}`);
        return { email: user.email, status: 'sent' };
      } else {
        console.log(`❌ Failed to send email to ${user.email}`);
        return { email: user.email, status: 'failed' };
      }
    });
    
    const results = await Promise.all(emailPromises);
    const successfulSends = results.filter(r => r && r.status === 'sent').length;
    
    console.log(`📊 Email sending complete. Successfully sent ${successfulSends} out of ${users.length} emails`);
    
    res.json({
      message: 'Test emails sent to all users',
      totalUsers: users.length,
      successfulSends,
      failedSends: users.length - successfulSends,
      results: results.filter(r => r !== null)
    });
    
  } catch (error) {
    console.error('❌ Error in send-all-users endpoint:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create a new tournament
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const tournament = await createTournament(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Register for a tournament
router.post('/:tournamentId/register', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { userId } = req.auth;

    const tournament = await registerForTournament(tournamentId, userId);
    res.status(200).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tournament details
router.get('/:tournamentId', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId)
      .populate('participants', 'name email')
      .populate('fixtures.player1', 'name')
      .populate('fixtures.player2', 'name');

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.status(200).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
