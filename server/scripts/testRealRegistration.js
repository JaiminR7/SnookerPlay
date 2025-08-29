import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const testRealRegistration = async () => {
  try {
    console.log('🧪 Testing registration with real-world scenario...');
    
    const serverUrl = 'http://localhost:5000';
    
    // Simulate a real registration request from the dashboard
    const testData = {
      userId: 'user_2realClerkId123', // This simulates a real Clerk user ID
      tournamentId: '688b6ac7f2f1b633768b58cb', // Use existing tournament
      userDetails: {
        name: 'Charusat User',
        email: '23cs082@charusat.edu.in', // This should match and trigger email
        phone: '1234567890',
        emergencyContact: 'Test Contact'
      }
    };
    
    console.log('📊 Test registration data:');
    console.log(JSON.stringify(testData, null, 2));
    
    console.log('\n🔄 Testing registration...');
    const response = await fetch(`${serverUrl}/api/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Registration successful:', result.message);
      console.log('📧 Check if confirmation email was sent!');
    } else {
      const errorText = await response.text();
      console.log('❌ Registration failed:', errorText);
    }
    
    // Wait a moment, then test cancellation
    console.log('\n⏳ Waiting 3 seconds before testing cancellation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔄 Testing cancellation...');
    const cancelResponse = await fetch(`${serverUrl}/api/registration/${testData.userId}/${testData.tournamentId}`, {
      method: 'DELETE'
    });
    
    if (cancelResponse.ok) {
      const cancelResult = await cancelResponse.json();
      console.log('✅ Cancellation successful:', cancelResult.message);
      console.log('📧 Check if cancellation email was sent!');
    } else {
      const errorText = await cancelResponse.text();
      console.log('❌ Cancellation failed:', errorText);
    }
    
    console.log('\n🎉 Test completed! Check server logs and email inbox.');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server not running! Start with: npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

testRealRegistration().catch(console.error);
