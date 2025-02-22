// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImagePath: { type: String, default: 'assets/default-profile.png' },
  description: { type: String, default: '' },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }], 
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
