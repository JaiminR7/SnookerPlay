
import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  registeredAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model('Registration', RegistrationSchema);
export default Registration;
