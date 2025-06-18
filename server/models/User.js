import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk User ID
  name: { type: String },
  email: { type: String },
  avatarUrl: { type: String },
  bio: { type: String },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Pro'], default: 'Beginner' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
