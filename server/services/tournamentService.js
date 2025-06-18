import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import { sendTournamentNotification, sendFixtureConfirmation } from '../utils/emailService.js';

// Create a new tournament and notify all users
export const createTournament = async (tournamentData) => {
  try {
    console.log('🎯 Creating new tournament:', tournamentData.title);
    const tournament = await Tournament.create(tournamentData);
    console.log('✅ Tournament created successfully:', tournament._id);

    // Get all users
    console.log('👥 Fetching all users for notification...');
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);

    // Safety check: ensure users is an array
    if (!Array.isArray(users)) {
      console.error('❌ Users query did not return an array:', typeof users);
      throw new Error('Expected users to be an array but got: ' + typeof users);
    }

    // Only send emails if users exist
    if (users.length > 0) {
      console.log(`🔔 Attempting to send tournament notifications to ${users.length} users`);
      try {
        const results = await sendTournamentNotification(users, tournament);
        const successCount = results.filter(Boolean).length;
        console.log(`✅ Emails sent successfully: ${successCount}/${users.length}`);
      } catch (emailError) {
        console.error('⚠️ Email error (not critical):', emailError.message);
        // Don't throw error here, just log
      }
    } else {
      console.warn('⚠️ No users found to notify about the tournament.');
    }

    return tournament;
  } catch (error) {
    console.error('❌ Error creating tournament:', error.message);
    throw new Error(`Error creating tournament: ${error.message}`);
  }
};

// Register a user for a tournament
export const registerForTournament = async (tournamentId, userId) => {
  try {
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      throw new Error('Tournament is full');
    }

    if (tournament.participants.includes(userId)) {
      throw new Error('User is already registered');
    }

    tournament.participants.push(userId);
    await tournament.save();

    // If tournament is now full, generate fixtures
    if (tournament.participants.length === tournament.maxParticipants) {
      await generateFixtures(tournament);
    }

    return tournament;
  } catch (error) {
    throw new Error(`Error registering for tournament: ${error.message}`);
  }
};

// Generate fixtures for a tournament
const generateFixtures = async (tournament) => {
  try {
    // Shuffle participants array
    const shuffledParticipants = [...tournament.participants].sort(() => Math.random() - 0.5);

    // Generate fixtures
    const fixtures = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
      fixtures.push({
        round: 1,
        matchNumber: Math.floor(i / 2) + 1,
        player1: shuffledParticipants[i],
        player2: shuffledParticipants[i + 1],
        status: 'pending'
      });
    }

    // Update tournament with fixtures
    tournament.fixtures = fixtures;
    await tournament.save();

    // Send fixture confirmation emails
    await sendFixtureConfirmation(tournament, fixtures);

    return tournament;
  } catch (error) {
    throw new Error(`Error generating fixtures: ${error.message}`);
  }
};
