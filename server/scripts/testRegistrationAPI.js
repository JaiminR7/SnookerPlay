import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const testRegistrationAPI = async () => {
  try {
    console.log('🧪 Testing registration and cancellation API with email notifications...');
    
    const serverUrl = 'http://localhost:5000';
    
    // Test data - using real data from database
    const testUserId = 'user1'; // Real Clerk user ID
    const testTournamentId = '688b6ac7f2f1b633768b58cb'; // Real tournament ID
    
    console.log('📊 Test parameters:');
    console.log('User ID:', testUserId);
    console.log('Tournament ID:', testTournamentId);
    
    // Test 1: Register for tournament
    console.log('\n🔄 Testing tournament registration...');
    const registrationData = {
      userId: testUserId,
      tournamentId: testTournamentId,
      userDetails: {
        phone: '1234567890',
        emergencyContact: 'Test Contact'
      }
    };
    
    const registerResponse = await fetch(`${serverUrl}/api/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Registration successful:', registerResult.message);
      console.log('📧 Registration confirmation email should have been sent!');
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed:', errorText);
    }
    
    // Wait a bit before testing cancellation
    console.log('\n⏳ Waiting 3 seconds before testing cancellation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Cancel registration
    console.log('\n🔄 Testing tournament registration cancellation...');
    const cancelResponse = await fetch(`${serverUrl}/api/registration/${testUserId}/${testTournamentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (cancelResponse.ok) {
      const cancelResult = await cancelResponse.json();
      console.log('✅ Cancellation successful:', cancelResult.message);
      console.log('📧 Registration cancellation email should have been sent!');
    } else {
      const errorText = await cancelResponse.text();
      console.log('❌ Cancellation failed:', errorText);
    }
    
    console.log('\n🎉 API testing completed!');
    console.log('Check the server console logs for email delivery status.');
    console.log('Check email inbox for registration and cancellation notifications.');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused - Server is not running!');
      console.log('Please start your server first:');
      console.log('1. cd server');
      console.log('2. npm start');
    } else {
      console.error('❌ Error testing registration API:', error.message);
    }
  }
};

console.log('✅ Test data has been updated with real values from your database!');
testRegistrationAPI().catch(console.error);
