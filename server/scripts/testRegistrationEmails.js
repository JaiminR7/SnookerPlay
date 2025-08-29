import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import { sendRegistrationConfirmation, sendRegistrationCancellation } from '../utils/emailService.js';

dotenv.config();

const testRegistrationEmails = async () => {
  try {
    console.log('📧 Testing registration email notifications...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database');
    
    // Get a user and tournament for testing
    const user = await User.findOne({}).limit(1);
    const tournament = await Tournament.findOne({}).limit(1);
    
    if (!user) {
      console.log('❌ No users found in database');
      return;
    }
    
    if (!tournament) {
      console.log('❌ No tournaments found in database');
      return;
    }
    
    console.log(`📊 Testing with user: ${user.name} (${user.email})`);
    console.log(`📊 Testing with tournament: ${tournament.title}`);
    
    if (!user.email) {
      console.log('❌ User has no email address');
      return;
    }
    
    console.log('\n📧 Testing registration confirmation email...');
    const confirmationResult = await sendRegistrationConfirmation(user.email, user.name, tournament);
    
    if (confirmationResult) {
      console.log('✅ Registration confirmation email sent successfully!');
    } else {
      console.log('❌ Failed to send registration confirmation email');
    }
    
    console.log('\n📧 Testing registration cancellation email...');
    const cancellationResult = await sendRegistrationCancellation(user.email, user.name, tournament);
    
    if (cancellationResult) {
      console.log('✅ Registration cancellation email sent successfully!');
    } else {
      console.log('❌ Failed to send registration cancellation email');
    }
    
    console.log('\n🎉 Email testing completed!');
    console.log('Check the email inbox for:', user.email);
    
  } catch (error) {
    console.error('❌ Error testing registration emails:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testRegistrationEmails().catch(console.error);
