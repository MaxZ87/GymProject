
const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const { protect } = require('../middleware/auth');

router.get('/history', protect, async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nutrition = await Nutrition.findOne({ 
      userId: req.user._id,
      date: today
    });
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/date/:date', protect, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const nutrition = await Nutrition.findOne({ 
      userId: req.user._id,
      date: date
    });
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/meal', protect, async (req, res) => {
  try {
    const date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0);
    
    let nutrition = await Nutrition.findOne({ 
      userId: req.user._id,
      date: date
    });
    
    if (!nutrition) {
      nutrition = new Nutrition({
        userId: req.user._id,
        date: date,
        meals: []
      });
    }
    
    nutrition.meals.push(req.body.meal);
    
    nutrition.totalCalories = nutrition.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    nutrition.totalProtein = nutrition.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
    nutrition.totalCarbs = nutrition.meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    nutrition.totalFat = nutrition.meals.reduce((sum, m) => sum + (m.fat || 0), 0);
    
    await nutrition.save();
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/meal/:mealId', protect, async (req, res) => {
  try {
    const nutrition = await Nutrition.findOne({ 'meals._id': req.params.mealId });
    const meal = nutrition.meals.id(req.params.mealId);
    Object.assign(meal, req.body);
    
    nutrition.totalCalories = nutrition.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    nutrition.totalProtein = nutrition.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
    nutrition.totalCarbs = nutrition.meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    nutrition.totalFat = nutrition.meals.reduce((sum, m) => sum + (m.fat || 0), 0);
    
    await nutrition.save();
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/meal/:mealId', protect, async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndUpdate(
      { 'meals._id': req.params.mealId },
      { $pull: { meals: { _id: req.params.mealId } } },
      { new: true }
    );
    
    if (nutrition) {
      nutrition.totalCalories = nutrition.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
      nutrition.totalProtein = nutrition.meals.reduce((sum, m) => sum + (m.protein || 0), 0);
      nutrition.totalCarbs = nutrition.meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
      nutrition.totalFat = nutrition.meals.reduce((sum, m) => sum + (m.fat || 0), 0);
      await nutrition.save();
    }
    
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
