import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const testTournamentCreationWithEmails = async () => {
  try {
    console.log('🏆 Testing tournament creation with email notifications...');
    
    // Check if server is running
    const serverUrl = 'http://localhost:5000'; // Adjust port if needed
    
    // Create a test tournament payload
    const tournamentData = {
      title: 'Live Test Tournament - Email Verification',
      description: 'This tournament was created to test the email notification system in real-time through the API.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      time: '2:00 PM',
      location: 'Charusat University, Snooker Hall',
      registrationFee: '₹750',
      prizePool: '₹7500',
      maxParticipants: 8,
      status: 'upcoming'
    };
    
    console.log('📊 Tournament data to create:');
    console.log({
      title: tournamentData.title,
      date: new Date(tournamentData.date).toLocaleDateString(),
      time: tournamentData.time,
      location: tournamentData.location,
      fee: tournamentData.registrationFee,
      prize: tournamentData.prizePool
    });
    
    console.log('\n🔄 Making API call to create tournament...');
    
    // Make POST request to create tournament
    const response = await fetch(`${serverUrl}/api/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API call failed with status ${response.status}`);
      console.error('Response:', errorText);
      
      if (response.status === 500) {
        console.log('\n⚠️ Server might not be running. Let me check...');
        console.log('Make sure your server is running with: npm start or node index.js');
      }
      return;
    }
    
    const createdTournament = await response.json();
    console.log('\n✅ Tournament created successfully!');
    console.log('Tournament ID:', createdTournament._id);
    console.log('Title:', createdTournament.title);
    
    console.log('\n📧 Email notifications should have been sent automatically!');
    console.log('Check the server console logs for email delivery status.');
    console.log('All users in your database should receive notification emails.');
    
    // Give some time for emails to be processed
    console.log('\n⏳ Waiting 3 seconds for email processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🎉 Test completed! Check:');
    console.log('1. Your email inboxes for tournament notifications');
    console.log('2. Server console logs for email delivery confirmations');
    console.log('3. Database to verify tournament was saved');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused - Server is not running!');
      console.log('Please start your server first:');
      console.log('1. cd server');
      console.log('2. npm start (or node index.js)');
    } else {
      console.error('❌ Error testing tournament creation:', error.message);
    }
  }
};

testTournamentCreationWithEmails().catch(console.error);
