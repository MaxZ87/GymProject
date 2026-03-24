
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: Number,
  bodyFat: Number,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number
  },
  strength: [{
    exercise: String,
    weight: Number,
    reps: Number
  }],
  notes: String
});

progressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
