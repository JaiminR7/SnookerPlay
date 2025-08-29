import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';

dotenv.config();

const getTestData = async () => {
  try {
    console.log('🔍 Finding test data for API testing...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database');
    
    // Get a user and tournament for testing
    const user = await User.findOne({}).limit(1);
    const tournament = await Tournament.findOne({}).limit(1);
    
    if (user && tournament) {
      console.log('\n📊 Test Data Found:');
      console.log(`User: ${user.name} (${user.email})`);
      console.log(`Clerk ID: ${user.clerkId}`);
      console.log(`Tournament: ${tournament.title}`);
      console.log(`Tournament ID: ${tournament._id}`);
      
      console.log('\n📝 You can now test the registration API with:');
      console.log('POST /api/registrations');
      console.log('Body:');
      console.log(JSON.stringify({
        userId: user.clerkId,
        tournamentId: tournament._id.toString(),
        userDetails: {
          phone: '1234567890',
          emergencyContact: 'Test Contact'
        }
      }, null, 2));
      
      console.log('\n📝 And test cancellation with:');
      console.log(`DELETE /api/registrations/${user.clerkId}/${tournament._id}`);
    } else {
      console.log('❌ Could not find suitable test data');
      if (!user) console.log('No users found');
      if (!tournament) console.log('No tournaments found');
    }
    
  } catch (error) {
    console.error('❌ Error getting test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

getTestData().catch(console.error);
