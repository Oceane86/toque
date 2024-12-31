// models/Challenge.js
import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  deadline: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
