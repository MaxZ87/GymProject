
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Training = require('../models/Training');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/trainers', protect, async (req, res) => {
  try {
    const { specialization, location } = req.query;
    let query = { role: 'trainer' };
    
    if (specialization) {
      query['profile.specialization'] = { $regex: specialization, $options: 'i' };
    }
    if (location) {
      query['profile.location'] = { $regex: location, $options: 'i' };
    }
    
    const trainers = await User.find(query).select('-password');
    
    const trainersWithCount = await Promise.all(trainers.map(async (trainer) => {
      const trainingsCount = await Training.countDocuments({ createdBy: trainer._id });
      return { ...trainer.toObject(), trainingsCount };
    }));
    
    res.json(trainersWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
