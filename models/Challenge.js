// models/Challenge.js

import mongoose from 'mongoose';


const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  endDate: { type: Date, required: true },
  ingredients: [String],
  instructions: String,
  createdBy: { type: String, required: true, default: 'Gemini' }, // Champ pour indiquer que Gemini a créé ce défi
  responses: [
    {
      email: String,
      title: String,
      text: String,
      imageUrl: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);

export default Challenge;
