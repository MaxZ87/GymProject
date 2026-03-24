
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    trainings: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Получаем количество клиентов
      let clientsCount = 0;
      try {
        const clientsRes = await api.get('/clients/trainer/clients/count');
        clientsCount = clientsRes.data.count || 0;
      } catch (err) {
        console.error('Ошибка загрузки клиентов:', err);
      }
      
      // Получаем количество тренировок
      let trainingsCount = 0;
      try {
        const trainingsRes = await api.get('/trainings/count');
        trainingsCount = trainingsRes.data.count || 0;
      } catch (err) {
        console.error('Ошибка загрузки тренировок:', err);
      }
      
      // Получаем количество непрочитанных сообщений
      let unreadMessages = 0;
      try {
        const unreadRes = await api.get('/chat/unread/count');
        unreadMessages = unreadRes.data.count || 0;
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
      }
      
      setStats({
        clients: clientsCount,
        trainings: trainingsCount,
        unreadMessages: unreadMessages
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-black border-2 border-yellow-400 rounded-2xl p-8 text-yellow-400">
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user?.name}!</h1>
        <p className="opacity-90">Ваш тренерский кабинет</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/trainer/clients" className="card hover:scale-105 transition-transform">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-lg text-black">Мои клиенты</h3>
          <p className="text-gray-600 text-sm mt-2">{stats.clients-1} клиентов</p>
        </Link>

        <Link to="/trainer/trainings" className="card hover:scale-105 transition-transform">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-lg text-black">Мои тренировки</h3>
          <p className="text-gray-600 text-sm mt-2">{stats.trainings} созданных</p>
        </Link>

        <Link to="/chat" className="card hover:scale-105 transition-transform relative">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-lg text-black">Сообщения</h3>
          <p className="text-gray-600 text-sm mt-2">
            {stats.unreadMessages > 0 ? `${stats.unreadMessages} новых` : 'Нет новых'}
          </p>
          {stats.unreadMessages > 0 && (
            <span className="notification-badge">{stats.unreadMessages}</span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default TrainerDashboard;
