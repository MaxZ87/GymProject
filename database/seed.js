const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({
  path: '../server/.env'
});

const User = require('../server/src/models/User');
const Training = require('../server/src/models/Training');
const ClientTrainer = require('../server/src/models/ClientTrainer');

const seedDatabase = async () => {
  try {
    console.log('Подключение к MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB подключена');

    await Promise.all([
      User.deleteMany({}),
      Training.deleteMany({}),
      ClientTrainer.deleteMany({})
    ]);
    console.log('📦 Старые данные удалены');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('✅ Тренировки созданы');

    console.log('📝 Данные для входа:');
    console.log('Клиент: client@test.com / password123');
    console.log('Тренер: trainer@test.com / password123');
    console.log('Доп. клиент: maria@test.com / password123');
    console.log('Доп. тренер: petr.trainer@test.com / password123');

    await mongoose.disconnect();
    console.log('🔌 Отключение от MongoDB');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
};

seedDatabase();