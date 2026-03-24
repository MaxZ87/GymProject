
const express = require('express');
const router = express.Router();
const ClientTrainer = require('../models/ClientTrainer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/my-trainers', protect, async (req, res) => {
  try {
    const relations = await ClientTrainer.find({ clientId: req.user._id }).populate('trainerId');
    res.json(relations.map(r => r.trainerId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/add-trainer', protect, async (req, res) => {
  try {
    const { trainerId } = req.body;
    
    const existing = await ClientTrainer.findOne({
      clientId: req.user._id,
      trainerId
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Тренер уже добавлен' });
    }
    
    await ClientTrainer.create({
      clientId: req.user._id,
      trainerId
    });
    
    res.json({ message: 'Тренер добавлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/remove-trainer/:trainerId', protect, async (req, res) => {
  try {
    const result = await ClientTrainer.findOneAndDelete({
      clientId: req.user._id,
      trainerId: req.params.trainerId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Связь не найдена' });
    }
    
    res.json({ message: 'Тренер удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршруты для тренера
router.get('/trainer/clients', protect, async (req, res) => {
  try {
    const relations = await ClientTrainer.find({ trainerId: req.user._id }).populate('clientId');
    console.log('Клиенты тренера:', relations.length);
    res.json(relations.map(r => r.clientId));
  } catch (error) {
    console.error('Ошибка загрузки клиентов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/trainer/clients/count', protect, async (req, res) => {
  try {
    const count = await ClientTrainer.countDocuments({ trainerId: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
