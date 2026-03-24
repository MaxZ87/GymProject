
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const FindTrainer = () => {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [myTrainers, setMyTrainers] = useState([]);
  const [filter, setFilter] = useState({ specialization: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
    fetchMyTrainers();
  }, [filter]);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/users/trainers', { params: filter });
      setTrainers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренеров:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTrainers = async () => {
    try {
      const response = await api.get('/clients/my-trainers');
      setMyTrainers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки моих тренеров:', error);
    }
  };

  const addTrainer = async (trainerId) => {
    try {
      await api.post('/clients/add-trainer', { trainerId });
      await fetchMyTrainers();
      alert('Тренер добавлен! Теперь вы видите его тренировки в "Мои тренировки"');
    } catch (error) {
      console.error('Ошибка добавления тренера:', error);
      alert('Ошибка при добавлении тренера');
    }
  };

  const removeTrainer = async (trainerId) => {
    if (window.confirm('Удалить тренера из списка? Все его тренировки пропадут из "Мои тренировки"')) {
      try {
        await api.delete(`/clients/remove-trainer/${trainerId}`);
        await fetchMyTrainers();
        alert('Тренер удален');
      } catch (error) {
        console.error('Ошибка удаления тренера:', error);
        alert('Ошибка при удалении тренера');
      }
    }
  };

  const isMyTrainer = (trainerId) => {
    return myTrainers.some(t => t._id === trainerId);
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Поиск тренера</h1>

      {myTrainers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-black">Мои тренеры ({myTrainers.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myTrainers.map(trainer => (
              <div key={trainer._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="avatar avatar-black w-10 h-10">
                    {trainer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-black">{trainer.name}</p>
                    <p className="text-xs text-gray-500">{trainer.profile?.specialization || 'Фитнес-тренер'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/client/trainer/${trainer._id}`} className="text-yellow-600 hover:text-yellow-700">
                    👁️
                  </Link>
                  <button onClick={() => removeTrainer(trainer._id)} className="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Специализация"
            className="input-field"
            value={filter.specialization}
            onChange={(e) => setFilter({...filter, specialization: e.target.value})}
          />
          <input
            type="text"
            placeholder="Город"
            className="input-field"
            value={filter.location}
            onChange={(e) => setFilter({...filter, location: e.target.value})}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {trainers.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Тренеры не найдены
          </div>
        ) : (
          trainers.map(trainer => (
            <div key={trainer._id} className="card hover:scale-105 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="avatar avatar-black w-16 h-16 text-2xl">
                  {trainer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-black">{trainer.name}</h3>
                  <p className="text-sm text-yellow-600">{trainer.profile?.specialization || 'Фитнес-тренер'}</p>
                  <p className="text-sm text-gray-600">{trainer.profile?.location || 'Город не указан'}</p>
                  <p className="text-xs text-gray-500 mt-1">Тренировок: {trainer.trainingsCount || 0}</p>
                  <div className="mt-3 flex space-x-2">
                    <Link 
                      to={`/client/trainer/${trainer._id}`}
                      className="btn-primary text-sm"
                    >
                      Профиль
                    </Link>
                    {isMyTrainer(trainer._id) ? (
                      <button 
                        onClick={() => removeTrainer(trainer._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Удалить
                      </button>
                    ) : (
                      <button 
                        onClick={() => addTrainer(trainer._id)}
                        className="btn-secondary text-sm"
                      >
                        Добавить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindTrainer;
