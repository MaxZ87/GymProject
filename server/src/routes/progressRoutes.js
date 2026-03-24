
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

router.get('/history', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/latest', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/date/:date', protect, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const progress = await Progress.findOne({ 
      userId: req.user._id,
      date: date
    });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/client/:clientId', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.clientId })
      .sort({ date: -1 })
      .limit(30);
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0);
    
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, date: date },
      { $set: req.body },
      { upsert: true, new: true }
    );
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Progress.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    res.json({ message: 'Запись удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
