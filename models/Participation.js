// app/models/Participation.js


import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Participation || mongoose.model('participations', participationSchema);
