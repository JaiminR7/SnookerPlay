import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables first
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
}

// Debug environment variables
console.log('🔍 Environment check:', {
  hasMongoUri: !!process.env.MONGO_URI,
  mongoUri: process.env.MONGO_URI ? 'set' : 'not set'
});

const users = [
  {
    clerkId: 'user1',
    name: 'Charusat User',
    email: '23cs082@charusat.edu.in',
    avatarUrl: '',
    bio: 'Charusat Student',
    skillLevel: 'Intermediate'
  },
  {
    clerkId: 'user2',
    name: 'Grand Tourer',
    email: 'grandtourer07@gmail.com',
    avatarUrl: '',
    bio: 'Snooker Player',
    skillLevel: 'Pro'
  },
  {
    clerkId: 'user3',
    name: 'Jaimin Radia',
    email: 'jaiminradia005@gmail.com',
    avatarUrl: '',
    bio: 'Snooker Player',
    skillLevel: 'Intermediate'
  },
  {
    clerkId: 'user4',
    name: 'Cervelt User',
    email: 'cervelt00@gmail.com',
    avatarUrl: '',
    bio: 'Snooker Player',
    skillLevel: 'Beginner'
  }
];

async function addUsers() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check for existing users
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User with email ${userData.email} already exists`);
      } else {
        const user = new User(userData);
        await user.save();
        console.log(`Added user: ${userData.email}`);
      }
    }

    console.log('All users processed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addUsers(); 