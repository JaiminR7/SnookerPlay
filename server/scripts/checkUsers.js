import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    console.log('🔍 Checking users in database...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Skill Level: ${user.skillLevel}`);
      console.log('   ---');
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

checkUsers().catch(console.error);
