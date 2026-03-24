
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [isMyTrainer, setIsMyTrainer] = useState(false);

  useEffect(() => {
    fetchTrainer();
    fetchTrainerTrainings();
    checkIfMyTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setTrainer(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренера:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerTrainings = async () => {
    try {
      const response = await api.get(`/trainings/trainer/${id}`);
      setTrainings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренировок тренера:', error);
    }
  };

  const checkIfMyTrainer = async () => {
    try {
      const response = await api.get('/clients/my-trainers');
      setIsMyTrainer(response.data.some(t => t._id === id));
    } catch (error) {
      console.error('Ошибка проверки тренера:', error);
    }
  };

  const addTrainer = async () => {
    try {
      await api.post('/clients/add-trainer', { trainerId: id });
      setIsMyTrainer(true);
      alert('Тренер добавлен! Теперь вы видите его тренировки в "Мои тренировки"');
    } catch (error) {
      console.error('Ошибка добавления тренера:', error);
      alert('Ошибка при добавлении тренера');
    }
  };

  const removeTrainer = async () => {
    if (window.confirm('Удалить тренера из списка?')) {
      try {
        await api.delete(`/clients/remove-trainer/${id}`);
        setIsMyTrainer(false);
        alert('Тренер удален');
      } catch (error) {
        console.error('Ошибка удаления тренера:', error);
        alert('Ошибка при удалении тренера');
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      await api.post(`/chat/${id}`, { content: message });
      setMessage('');
      setShowMessageForm(false);
      alert('Сообщение отправлено!');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  const startChat = () => {
    navigate('/chat', { state: { selectedUserId: id } });
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка...</div>;
  }

  if (!trainer) {
    return <div className="text-center text-red-400">Тренер не найден</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/client/find-trainer')}
        className="text-yellow-400 hover:text-yellow-300 mb-4 inline-block"
      >
        ← Назад к поиску
      </button>

      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="avatar avatar-black w-24 h-24 text-4xl">
              {trainer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">{trainer.name}</h1>
              <p className="text-yellow-600 text-lg mt-1">{trainer.profile?.specialization || 'Фитнес-тренер'}</p>
              <p className="text-gray-600">{trainer.profile?.location || 'Город не указан'}</p>
              <p className="text-sm text-gray-500 mt-1">Тренировок: {trainings.length}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isMyTrainer ? (
              <button 
                onClick={removeTrainer}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
              >
                Удалить тренера
              </button>
            ) : (
              <button 
                onClick={addTrainer}
                className="btn-primary"
              >
                + Добавить тренера
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-600">О тренере</h2>
          <p className="text-gray-700 mb-6">
            {trainer.profile?.bio || 'Тренер пока не добавил информацию о себе.'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Опыт работы</p>
              <p className="font-medium text-black">{trainer.profile?.experience || 'Не указан'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Специализация</p>
              <p className="font-medium text-black">{trainer.profile?.specialization || 'Не указана'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Образование</p>
              <p className="font-medium text-black">{trainer.profile?.education || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Сертификаты</p>
              <p className="font-medium text-black">{trainer.profile?.certificates || 'Не указаны'}</p>
            </div>
          </div>

          <div className="flex space-x-3 mb-6">
            <button 
              onClick={startChat}
              className="btn-primary"
            >
              💬 Написать сообщение
            </button>
            {!showMessageForm && (
              <button 
                onClick={() => setShowMessageForm(true)}
                className="btn-secondary"
              >
                📝 Быстрое сообщение
              </button>
            )}
          </div>

          {showMessageForm && (
            <div className="mb-6 space-y-3">
              <textarea
                className="input-field"
                rows="3"
                placeholder="Введите ваше сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex space-x-2">
                <button 
                  onClick={sendMessage}
                  disabled={sending || !message.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {sending ? 'Отправка...' : 'Отправить'}
                </button>
                <button 
                  onClick={() => setShowMessageForm(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {trainings.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 text-black">Тренировки тренера:</h3>
              <div className="grid grid-cols-2 gap-3">
                {trainings.map(training => (
                  <div key={training._id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium text-black">{training.title}</p>
                    <p className="text-sm text-gray-500">{training.duration} мин • {training.level === 'beginner' ? 'Начинающий' : training.level === 'intermediate' ? 'Средний' : 'Продвинутый'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
