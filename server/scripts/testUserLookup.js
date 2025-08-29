import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const testUserCreation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the current user that's trying to register (from logs)
    const clerkId = 'user_2wywmtyCuiNVt54GfKlL3f5zFhD';
    console.log(`🔍 Looking for user with clerkId: ${clerkId}`);

    const user = await User.findOne({ clerkId });
    
    if (user) {
      console.log('✅ Found user:', {
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        skillLevel: user.skillLevel
      });
    } else {
      console.log('❌ User not found in database');
      console.log('📝 Creating test user for current session...');
      
      // Create a user for testing (replace with your actual email)
      const testUser = new User({
        clerkId: clerkId,
        email: '173jaiminradia@gmail.com', // Replace with your actual email
        name: 'Test User',
        skillLevel: 'Beginner',
        bio: 'Test user for email functionality'
      });
      
      await testUser.save();
      console.log('✅ Created test user:', testUser.email);
    }

    // List all users
    const allUsers = await User.find().select('clerkId name email');
    console.log('📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.clerkId})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testUserCreation();
