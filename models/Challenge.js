// models/Challenge.js

import mongoose from 'mongoose';
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  endDate: { type: Date, required: true },
  ingredients: [String],
  instructions: String,
  createdBy: { type: String, required: true, default: 'Gemini' },
  responses: [
    {
      email: String,
      title: String,
      text: String,
      imageUrl: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  photos: [
    {
      type: [String],
      default: [],      
      date: { type: Date, default: Date.now },
    },
  ],
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);

export default Challenge;
