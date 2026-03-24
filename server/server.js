
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB подключена успешно'))
  .catch(err => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  });

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/trainings', require('./src/routes/trainingRoutes'));
app.use('/api/nutrition', require('./src/routes/nutritionRoutes'));
app.use('/api/progress', require('./src/routes/progressRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));

app.get('/', (req, res) => {
  res.send('FitLife Pro API работает');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
