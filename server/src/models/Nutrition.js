
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  time: { type: Date, default: Date.now }
});

const nutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [mealSchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 }
});

nutritionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);
