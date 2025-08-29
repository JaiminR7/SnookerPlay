import express from 'express';
import { sendTournamentNotification } from '../utils/emailService.js';

const router = express.Router();

// Test tournament notification email
router.get('/test-tournament-email', async (req, res) => {
  try {
    // Mock user data
    const testUser = {
      email: '173jaiminradia@gmail.com',
      name: 'Jaimin'
    };

    // Mock tournament data
    const testTournament = {
      title: 'Test Championship',
      location: 'Local Snooker Club',
      date: new Date(),
      time: '10:00 AM',
      registrationFee: '₹500',
      prizePool: '₹5000'
    };

    console.log('🏆 Testing tournament notification email...');
    const result = await sendTournamentNotification([testUser], testTournament);
    
    if (result && result.length > 0 && result[0]) {
      res.json({ 
        success: true, 
        message: 'Tournament notification email sent successfully!',
        messageId: result[0].messageId
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Failed to send tournament notification email' 
      });
    }
  } catch (error) {
    console.error('❌ Tournament email test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending tournament notification', 
      error: error.message 
    });
  }
});

export default router;
