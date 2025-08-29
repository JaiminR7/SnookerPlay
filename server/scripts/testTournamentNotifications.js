import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { sendTournamentNotification } from '../utils/emailService.js';

dotenv.config();

const testTournamentNotifications = async () => {
  try {
    console.log('🔧 Testing tournament notification system...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database');
    
    // Get all users from database
    const users = await User.find({}).select('email name');
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Create a test tournament object (simulating what would be passed from the route)
    const testTournament = {
      title: 'Test Tournament - Email Notification Test',
      location: 'Test Venue, Charusat',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: '10:00 AM',
      registrationFee: '₹500',
      prizePool: '₹5000',
      description: 'This is a test tournament to verify email notifications are working properly.'
    };
    
    console.log('📧 Sending tournament notification emails...');
    console.log('Tournament details:', {
      title: testTournament.title,
      date: testTournament.date.toLocaleDateString(),
      location: testTournament.location
    });
    
    // Send notifications to all users
    const results = await sendTournamentNotification(users, testTournament);
    
    // Count successful and failed emails
    const successful = results.filter(result => result !== null).length;
    const failed = results.filter(result => result === null).length;
    
    console.log('\n📊 Email Results:');
    console.log(`✅ Successfully sent: ${successful} emails`);
    console.log(`❌ Failed to send: ${failed} emails`);
    
    if (successful === users.length) {
      console.log('🎉 All tournament notification emails sent successfully!');
    } else if (successful > 0) {
      console.log('⚠️ Some emails failed to send. Check logs above for details.');
    } else {
      console.log('❌ No emails were sent successfully. Check email configuration.');
    }
    
  } catch (error) {
    console.error('❌ Error testing tournament notifications:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testTournamentNotifications().catch(console.error);
