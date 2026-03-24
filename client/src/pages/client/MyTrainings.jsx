
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const MyTrainings = () => {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trainings/my');
      console.log('Мои тренировки:', response.data);
      setTrainings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTraining = (training) => {
    setSelectedTraining(training);
    setTimer(training.duration * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    return <div className="text-center text-yellow-400">Загрузка тренировок...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Мои тренировки ({trainings.length})</h1>
      
      {selectedTraining ? (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-black">{selectedTraining.title}</h2>
          <div className="text-4xl font-mono mb-4 text-center">{formatTime(timer)}</div>
          
          <div className="space-y-4 mb-6">
            {selectedTraining.exercises?.map((exercise, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-400">{exercise.name}</h3>
                <p className="text-gray-400">
                  {exercise.sets} x {exercise.reps} {exercise.weight ? `(${exercise.weight} кг)` : ''}
                </p>
                {renderMedia(exercise)}
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="btn-primary"
            >
              {isTimerRunning ? 'Пауза' : 'Старт'}
            </button>
            <button 
              onClick={() => setSelectedTraining(null)}
              className="btn-secondary"
            >
              Завершить
            </button>
          </div>
        </div>
      ) : (
        <>
          {trainings.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg mb-4">У вас пока нет тренировок</p>
              <p className="text-gray-400">Добавьте тренера в разделе <Link to="/client/find-trainer" className="text-yellow-400 hover:underline">Найти тренера</Link> чтобы получить доступ к его тренировкам</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map(training => (
                <div key={training._id} className="card group hover:scale-105">
                  <h3 className="font-semibold text-lg mb-2 text-black line-clamp-1">{training.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{training.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-yellow">
                      {training.level === 'beginner' ? 'Начинающий' : training.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </span>
                    <span className="text-sm text-gray-500">{training.duration} мин</span>
                    <span className="text-sm text-gray-500">{training.exercises?.length || 0} упр.</span>
                  </div>
                  {training.createdBy && training.createdBy.name && (
                    <p className="text-xs text-gray-400 mb-3">
                      Тренер: {training.createdBy.name}
                    </p>
                  )}
                  <button 
                    onClick={() => startTraining(training)}
                    className="btn-primary text-sm w-full"
                  >
                    Начать
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTrainings;
