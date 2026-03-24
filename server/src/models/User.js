
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'trainer', 'admin'], default: 'client' },
  profile: {
    age: Number,
    weight: Number,
    height: Number,
    goals: String,
    location: String,
    specialization: String,
    experience: String,
    education: String,
    certificates: String,
    bio: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
