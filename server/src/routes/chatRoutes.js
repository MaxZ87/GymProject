
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
    .populate('senderId', 'name email role profile')
    .populate('receiverId', 'name email role profile')
    .sort({ createdAt: -1 });
    
    const conversations = [];
    const seen = new Set();
    
    messages.forEach(msg => {
      const otherUser = msg.senderId._id.toString() === req.user._id.toString() 
        ? msg.receiverId 
        : msg.senderId;
      
      if (!seen.has(otherUser._id.toString())) {
        seen.add(otherUser._id.toString());
        conversations.push({
          user: otherUser,
          lastMessage: msg,
          unread: !msg.read && msg.receiverId._id.toString() === req.user._id.toString()
        });
      }
    });
    
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    })
    .populate('senderId', 'name')
    .populate('receiverId', 'name')
    .sort({ createdAt: 1 });
    
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user._id, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:userId', protect, async (req, res) => {
  try {
    const message = await Message.create({
      senderId: req.user._id,
      receiverId: req.params.userId,
      content: req.body.content
    });
    
    await message.populate('senderId', 'name');
    await message.populate('receiverId', 'name');
    
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/conversation', protect, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select('name email role profile');
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
