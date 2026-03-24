
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ManageTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trainings/trainer');
      console.log('Тренировки тренера:', response.data);
      setTrainings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTraining = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить тренировку? Она исчезнет из библиотеки и у всех клиентов')) {
      try {
        await api.delete(`/trainings/${id}`);
        await fetchTrainings();
        alert('Тренировка удалена');
      } catch (error) {
        console.error('Ошибка удаления тренировки:', error);
        alert('Ошибка при удалении тренировки');
      }
    }
  };

  const togglePublic = async (training) => {
    try {
      await api.put(`/trainings/${training._id}`, {
        ...training,
        isPublic: !training.isPublic
      });
      await fetchTrainings();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      alert('Ошибка при изменении статуса');
    }
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка тренировок...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="section-title">Мои тренировки ({trainings.length})</h1>
        <Link to="/trainer/create" className="btn-primary">
          + Создать тренировку
        </Link>
      </div>

      {trainings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">У вас пока нет созданных тренировок</p>
          <p className="text-gray-400 mb-6">Создайте свою первую тренировку, чтобы она появилась здесь</p>
          <Link to="/trainer/create" className="btn-primary inline-block">
            Создать первую тренировку
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map(training => (
            <div key={training._id} className="card group hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-black line-clamp-1 flex-1">{training.title}</h3>
                <div className="flex space-x-1 ml-2">
                  <Link 
                    to={`/trainer/edit/${training._id}`}
                    className="text-yellow-600 hover:text-yellow-700 p-1"
                    title="Редактировать"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => deleteTraining(training._id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{training.description || 'Нет описания'}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-yellow">
                  {training.level === 'beginner' ? 'Начинающий' : training.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </span>
                <span className="text-sm text-gray-500">{training.duration} мин</span>
                <span className="text-sm text-gray-500">{training.exercises?.length || 0} упр.</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={training.isPublic}
                    onChange={() => togglePublic(training)}
                    className="form-checkbox text-yellow-400 w-3 h-3"
                  />
                  <span className={training.isPublic ? 'text-green-600' : 'text-gray-500'}>
                    {training.isPublic ? '🔓 Публичная' : '🔒 Приватная'}
                  </span>
                </label>
                <Link 
                  to={`/trainer/edit/${training._id}`}
                  className="btn-secondary text-xs px-3 py-1"
                >
                  Редактировать
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTrainings;
