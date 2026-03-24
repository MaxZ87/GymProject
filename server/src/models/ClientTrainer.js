
const mongoose = require('mongoose');

const clientTrainerSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

clientTrainerSchema.index({ clientId: 1, trainerId: 1 }, { unique: true });

module.exports = mongoose.model('ClientTrainer', clientTrainerSchema);
