import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import { sendRegistrationConfirmation } from '../utils/emailService.js';

dotenv.config();

const testRegistrationEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a test user and tournament
    const user = await User.findOne({ email: { $exists: true } });
    const tournament = await Tournament.findOne();

    if (!user) {
      console.log('❌ No user found with email');
      return;
    }

    if (!tournament) {
      console.log('❌ No tournament found');
      return;
    }

    console.log(`📧 Testing registration email for:
    User: ${user.name} (${user.email})
    Tournament: ${tournament.title}`);

    // Send registration confirmation email
    const result = await sendRegistrationConfirmation(user.email, user.name, tournament);
    
    if (result) {
      console.log('✅ Registration confirmation email sent successfully!');
    } else {
      console.log('❌ Failed to send registration confirmation email');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testRegistrationEmail();
