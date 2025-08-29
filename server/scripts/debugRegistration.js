import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const debugRegistration = async () => {
  try {
    console.log('🔍 Debugging registration email issue...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Test with a sample real Clerk ID that might come from the dashboard
    const testClerkId = 'user_2xxxxxxxxxxxxx'; // This would be a real Clerk ID
    const user = await User.findOne({ clerkId: testClerkId });
    
    console.log(`\n🔍 Looking for user with Clerk ID: ${testClerkId}`);
    console.log(`📊 User found:`, user ? 'YES' : 'NO');
    
    if (user) {
      console.log(`✅ User details:`, {
        name: user.name,
        email: user.email,
        clerkId: user.clerkId
      });
    } else {
      console.log('❌ User not found - this is why emails are not being sent!');
      console.log('\n💡 Solution options:');
      console.log('1. Update database users with real Clerk IDs');
      console.log('2. Create a mapping system');
      console.log('3. Auto-create users when they first register');
    }
    
    // Show current users in database
    console.log('\n📊 Current users in database:');
    const allUsers = await User.find({}).select('name email clerkId');
    allUsers.forEach(user => {
      console.log(`   ${user.name}: ${user.clerkId} (${user.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

debugRegistration().catch(console.error);
