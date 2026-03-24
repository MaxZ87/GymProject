
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const Library = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, [selectedType]);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response = await api.get('/trainings/public', { params });
      console.log('Публичные тренировки:', response.data);
      setTrainings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки библиотеки:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (exercise) => {
    if (exercise.videoUrl) {
      if (exercise.videoUrl.includes('youtube')) {
        const videoId = exercise.videoUrl.split('v=')[1]?.split('&')[0];
        if (videoId) {
          return (
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg mt-2"
            ></iframe>
          );
        }
      } else if (exercise.videoUrl.includes('vimeo')) {
        const videoId = exercise.videoUrl.split('/').pop();
        if (videoId) {
          return (
            <iframe
              width="100%"
              height="200"
              src={`https://player.vimeo.com/video/${videoId}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="rounded-lg mt-2"
            ></iframe>
          );
        }
      }
    }
    if (exercise.imageUrl) {
      return <img src={exercise.imageUrl} alt={exercise.name} className="rounded-lg mt-2 max-h-40 object-cover" />;
    }
    return null;
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка библиотеки...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Библиотека тренировок ({trainings.length})</h1>

      <div className="card">
        <div className="flex space-x-2">
          {['all', 'strength', 'cardio', 'flexibility'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === type 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {type === 'all' ? 'Все' : 
               type === 'strength' ? 'Силовые' :
               type === 'cardio' ? 'Кардио' : 'Растяжка'}
            </button>
          ))}
        </div>
      </div>

      {trainings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">В библиотеке пока нет тренировок</p>
          {user?.role === 'trainer' && (
            <Link to="/trainer/create" className="btn-primary mt-4 inline-block">
              Создать первую тренировку
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {trainings.map(training => (
            <div key={training._id} className="card group hover:scale-105">
              <h3 className="font-semibold text-lg mb-2 text-black line-clamp-1">{training.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{training.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {training.level === 'beginner' ? 'Начинающий' : training.level === 'intermediate' ? 'Средний' : 'Продвинутый'} • {training.duration} мин
                </span>
                <span className="text-sm text-gray-500">
                  {training.exercises?.length || 0} упр.
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Тренер: {training.createdBy?.name || 'Неизвестно'}
                </span>
                <button 
                  onClick={() => setSelectedTraining(training)}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  Просмотреть
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-yellow-400 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">{selectedTraining.title}</h2>
              <button 
                onClick={() => setSelectedTraining(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 mb-2">Тренер: {selectedTraining.createdBy?.name || 'Неизвестно'}</p>
            <p className="text-gray-300 mb-4">{selectedTraining.description}</p>

            <div className="mb-4 flex space-x-2">
              <span className="badge badge-yellow">{selectedTraining.level === 'beginner' ? 'Начинающий' : selectedTraining.level === 'intermediate' ? 'Средний' : 'Продвинутый'}</span>
              <span className="badge bg-gray-700 text-white">{selectedTraining.duration} мин</span>
              <span className="badge bg-gray-700 text-white">{selectedTraining.type === 'strength' ? 'Силовая' : selectedTraining.type === 'cardio' ? 'Кардио' : 'Растяжка'}</span>
            </div>

            <h3 className="font-semibold text-lg mb-3 text-yellow-400">Упражнения:</h3>
            <div className="space-y-4">
              {selectedTraining.exercises?.map((exercise, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium text-lg text-white">{exercise.name}</h4>
                  <p className="text-gray-400 mb-2">
                    {exercise.sets} x {exercise.reps} {exercise.weight ? `(${exercise.weight} кг)` : ''}
                  </p>
                  {renderMedia(exercise)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
