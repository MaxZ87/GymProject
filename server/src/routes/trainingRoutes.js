
const express = require('express');
const router = express.Router();
const Training = require('../models/Training');
const ClientTrainer = require('../models/ClientTrainer');
const { protect } = require('../middleware/auth');

// Мои тренировки (для клиента)
router.get('/my', protect, async (req, res) => {
  try {
    if (req.user.role === 'client') {
      const myTrainers = await ClientTrainer.find({ clientId: req.user._id }).distinct('trainerId');
      
      const trainings = await Training.find({ 
        createdBy: { $in: myTrainers },
        isPublic: true
      }).populate('createdBy', 'name');
      
      res.json(trainings);
    } else {
      const trainings = await Training.find({ 
        createdBy: req.user._id 
      }).populate('createdBy', 'name');
      res.json(trainings);
    }
  } catch (error) {
    console.error('Ошибка загрузки моих тренировок:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Публичные тренировки
router.get('/public', protect, async (req, res) => {
  try {
    const { type } = req.query;
    let query = { isPublic: true };
    if (type && type !== 'all') {
      query.type = type;
    }
    const trainings = await Training.find(query).populate('createdBy', 'name');
    res.json(trainings);
  } catch (error) {
    console.error('Ошибка загрузки публичных тренировок:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Тренировки конкретного тренера
router.get('/trainer/:trainerId', protect, async (req, res) => {
  try {
    const trainings = await Training.find({ 
      createdBy: req.params.trainerId,
      isPublic: true
    }).populate('createdBy', 'name');
    res.json(trainings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Тренировки тренера (для управления)
router.get('/trainer', protect, async (req, res) => {
  try {
    const trainings = await Training.find({ createdBy: req.user._id }).populate('createdBy', 'name');
    console.log('Тренировки тренера:', trainings.length);
    res.json(trainings);
  } catch (error) {
    console.error('Ошибка загрузки тренировок тренера:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Количество тренировок тренера
router.get('/count', protect, async (req, res) => {
  try {
    const count = await Training.countDocuments({ createdBy: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error('Ошибка получения количества тренировок:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить тренировку по ID
router.get('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findById(req.params.id).populate('createdBy', 'name');
    if (!training) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }
    res.json(training);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать тренировку
router.post('/', protect, async (req, res) => {
  try {
    const trainingData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const training = await Training.create(trainingData);
    res.status(201).json(training);
  } catch (error) {
    console.error('Ошибка создания тренировки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить тренировку
router.put('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: req.body },
      { new: true }
    );
    
    if (!training) {
      return res.status(404).json({ message: 'Тренировка не найдена или у вас нет прав' });
    }
    
    res.json(training);
  } catch (error) {
    console.error('Ошибка обновления тренировки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить тренировку
router.delete('/:id', protect, async (req, res) => {
  try {
    const training = await Training.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });
    
    if (!training) {
      return res.status(404).json({ message: 'Тренировка не найдена или у вас нет прав' });
    }
    
    res.json({ message: 'Тренировка удалена' });
  } catch (error) {
    console.error('Ошибка удаления тренировки:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
