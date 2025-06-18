import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const user = new User({
  clerkId: 'test123',
  name: 'Test User',
  email: '173jaiminradia@gmail.com',
  avatarUrl: '',
  bio: 'Test user for email',
  skillLevel: 'Beginner'
});

await user.save();
console.log('User added:', user);
process.exit();