
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number,
  duration: Number,
  videoUrl: String,
  imageUrl: String,
  notes: String
});

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['strength', 'cardio', 'flexibility', 'custom'], default: 'strength' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  exercises: [exerciseSchema],
  duration: { type: Number, default: 30 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Training', trainingSchema);
