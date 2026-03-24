
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '💪', title: 'Управление тренировками', desc: 'Создавайте и отслеживайте персональные тренировки' },
    { icon: '🥗', title: 'Дневник питания', desc: 'Контролируйте калории и КБЖУ' },
    { icon: '📊', title: 'Прогресс и статистика', desc: 'Визуализация результатов и достижений' },
    { icon: '💬', title: 'Чат с тренером', desc: 'Общайтесь с тренером в реальном времени' },
    { icon: '🔍', title: 'Поиск тренера', desc: 'Найдите идеального тренера по своим целям' },
    { icon: '📚', title: 'Библиотека упражнений', desc: 'Доступ к базе тренировок и видео' }
  ];

  return (
    <div className="min-h-screen">
      <div className="rounded-2xl mx-4 my-8 p-12 relative overflow-hidden bg-black border-2 border-yellow-400">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400">
            FitLife Pro
          </h1>
          <p className="text-xl text-yellow-200 mb-8 max-w-2xl mx-auto">
            Единая цифровая среда для взаимодействия клиентов и фитнес-тренеров
          </p>
          
          {!user ? (
            <div className="space-x-4">
              <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                Начать бесплатно
              </Link>
              <Link to="/login" className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                Войти
              </Link>
            </div>
          ) : (
            <Link 
              to={user.role === 'client' ? '/client/dashboard' : '/trainer/dashboard'} 
              className="btn-secondary text-lg px-8 py-3"
            >
              Перейти в личный кабинет
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="section-title">Возможности платформы</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group hover:scale-105">
              <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
              <div className="mt-4 w-12 h-1 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
