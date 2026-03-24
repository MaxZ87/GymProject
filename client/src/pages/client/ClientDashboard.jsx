
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myTrainers, setMyTrainers] = useState([]);
  const [stats, setStats] = useState({
    trainingsCount: 0,
    calories: 0,
    weight: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingsRes, nutritionRes, progressRes, unreadRes, trainersRes] = await Promise.all([
          api.get('/trainings/my'),
          api.get('/nutrition/today'),
          api.get('/progress/latest'),
          api.get('/chat/unread/count'),
          api.get('/clients/my-trainers')
        ]);
        
        setStats({
          trainingsCount: trainingsRes.data.length,
          calories: nutritionRes.data?.totalCalories || 0,
          weight: progressRes.data?.weight || 0,
          unreadMessages: unreadRes.data.count
        });
        setMyTrainers(trainersRes.data);
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
      }
    };
    fetchData();
    
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const startChat = (userId) => {
    navigate('/chat', { state: { selectedUserId: userId } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black border-2 border-yellow-400 rounded-2xl p-8 text-yellow-400">
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user?.name}!</h1>
        <p className="opacity-90">Ваш персональный фитнес-портал</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/client/trainings" className="card hover:scale-105 transition-transform">
          <div className="text-3xl mb-3">💪</div>
          <h3 className="font-semibold text-lg">Мои тренировки</h3>
          <p className="text-gray-600 text-sm mt-2">{stats.trainingsCount} тренировок</p>
        </Link>

        <Link to="/client/nutrition" className="card hover:scale-105 transition-transform">
          <div className="text-3xl mb-3">🥗</div>
          <h3 className="font-semibold text-lg">Питание</h3>
          <p className="text-gray-600 text-sm mt-2">Сегодня: {stats.calories} ккал</p>
        </Link>

        <Link to="/client/progress" className="card hover:scale-105 transition-transform">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-lg">Прогресс</h3>
          <p className="text-gray-600 text-sm mt-2">Вес: {stats.weight} кг</p>
        </Link>

        <Link to="/chat" className="card hover:scale-105 transition-transform relative">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-lg">Сообщения</h3>
          <p className="text-gray-600 text-sm mt-2">
            {stats.unreadMessages > 0 ? `${stats.unreadMessages} новых` : 'Нет новых'}
          </p>
          {stats.unreadMessages > 0 && (
            <span className="notification-badge">{stats.unreadMessages}</span>
          )}
        </Link>
      </div>

      {myTrainers.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Мои тренеры ({myTrainers.length})</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTrainers.map(trainer => (
              <div key={trainer._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="avatar avatar-black w-12 h-12">
                    {trainer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-black">{trainer.name}</p>
                    <p className="text-sm text-gray-500">{trainer.profile?.specialization || 'Тренер'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => startChat(trainer._id)}
                  className="btn-primary text-xs px-3 py-1"
                >
                  Написать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
