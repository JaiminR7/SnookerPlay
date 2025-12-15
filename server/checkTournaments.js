// Quick script to check existing tournaments
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const TournamentSchema = new mongoose.Schema({
  title: String,
  registrationFee: String,
  prizePool: String,
  date: Date,
  location: String,
}, { collection: 'tournaments' });

const Tournament = mongoose.model('Tournament', TournamentSchema);

async function checkTournaments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const tournaments = await Tournament.find({});
    console.log('Found tournaments:');
    tournaments.forEach(t => {
      console.log(`- ${t.title}: Fee: "${t.registrationFee}", Prize: "${t.prizePool}"`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTournaments();