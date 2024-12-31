
// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImagePath: { type: String, default: 'assets/default-profile.png' },
  status: {
    type: String,
    enum: ['visiteur', 'participant'],
    required: true,
  },
  description: { type: String, default: '' },
  challengeIds: [{ type: String, ref: 'Challenge' }],  
  postEmails: [{ type: String, ref: 'Post' }],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
