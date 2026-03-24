
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/chat/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Ошибка загрузки уведомлений:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black border-b-4 border-yellow-400 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              FitLife Pro
            </span>
            <span className="text-yellow-400 text-2xl">⚡</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {!user ? (
              <>
                <Link to="/" className="nav-link">Главная</Link>
                <Link to="/login" className="nav-link">Вход</Link>
                <Link to="/register" className="nav-link">Регистрация</Link>
              </>
            ) : (
              <>
                {user.role === 'client' && (
                  <>
                    <Link to="/client/dashboard" className="nav-link">Главная</Link>
                    <Link to="/client/trainings" className="nav-link">Мои тренировки</Link>
                    <Link to="/client/nutrition" className="nav-link">Питание</Link>
                    <Link to="/client/progress" className="nav-link">Прогресс</Link>
                    <Link to="/client/find-trainer" className="nav-link">Найти тренера</Link>
                  </>
                )}
                {user.role === 'trainer' && (
                  <>
                    <Link to="/trainer/dashboard" className="nav-link">Главная</Link>
                    <Link to="/trainer/trainings" className="nav-link">Тренировки</Link>
                    <Link to="/trainer/clients" className="nav-link">Клиенты</Link>
                    <Link to="/trainer/create" className="btn-primary !py-1">+ Создать</Link>
                  </>
                )}
                <Link to="/library" className="nav-link">Библиотека</Link>
                <Link to="/chat" className="nav-link relative">
                  Чат
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </Link>
                <Link to="/profile" className="nav-link">Профиль</Link>
              </>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 group">
                <div className="avatar avatar-yellow">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-300 hidden lg:block group-hover:text-yellow-400">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
