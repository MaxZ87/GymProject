
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const CreateTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [training, setTraining] = useState({
    title: '',
    description: '',
    type: 'strength',
    level: 'beginner',
    duration: 30,
    isPublic: true,
    exercises: [{ 
      name: '', 
      sets: 3, 
      reps: 10, 
      weight: 0,
      videoUrl: '',
      imageUrl: ''
    }]
  });

  useEffect(() => {
    if (id) {
      fetchTraining();
    }
  }, [id]);

  const fetchTraining = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trainings/${id}`);
      setTraining(response.data);
    } catch (error) {
      console.error('Ошибка загрузки тренировки:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setTraining({
      ...training,
      exercises: [...training.exercises, { 
        name: '', 
        sets: 3, 
        reps: 10, 
        weight: 0,
        videoUrl: '',
        imageUrl: ''
      }]
    });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...training.exercises];
    newExercises[index][field] = value;
    setTraining({ ...training, exercises: newExercises });
  };

  const removeExercise = (index) => {
    const newExercises = training.exercises.filter((_, i) => i !== index);
    setTraining({ ...training, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!training.title.trim()) {
      alert('Введите название тренировки');
      return;
    }
    
    setSaving(true);
    try {
      let response;
      if (id) {
        response = await api.put(`/trainings/${id}`, training);
        alert('Тренировка успешно обновлена!');
      } else {
        response = await api.post('/trainings', training);
        alert('Тренировка успешно создана! Теперь она доступна в библиотеке и у ваших клиентов');
      }
      console.log('Сохраненная тренировка:', response.data);
      navigate('/trainer/trainings');
    } catch (error) {
      console.error('Ошибка сохранения тренировки:', error);
      alert('Ошибка при сохранении тренировки: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    } finally {
      setSaving(false);
    }
  };

  if (loading && id) {
    return <div className="text-center text-yellow-400">Загрузка...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="section-title">
        {id ? 'Редактирование тренировки' : 'Создание тренировки'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название тренировки *</label>
            <input
              type="text"
              className="input-field"
              value={training.title}
              onChange={(e) => setTraining({ ...training, title: e.target.value })}
              required
              placeholder="Например: Утренняя зарядка"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              className="input-field"
              rows="3"
              value={training.description}
              onChange={(e) => setTraining({ ...training, description: e.target.value })}
              placeholder="Опишите тренировку..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип тренировки</label>
              <select
                className="input-field"
                value={training.type}
                onChange={(e) => setTraining({ ...training, type: e.target.value })}
              >
                <option value="strength">Силовая</option>
                <option value="cardio">Кардио</option>
                <option value="flexibility">Растяжка</option>
                <option value="custom">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Уровень сложности</label>
              <select
                className="input-field"
                value={training.level}
                onChange={(e) => setTraining({ ...training, level: e.target.value })}
              >
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Длительность (минут)</label>
            <input
              type="number"
              className="input-field"
              value={training.duration}
              onChange={(e) => setTraining({ ...training, duration: parseInt(e.target.value) })}
              min="1"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={training.isPublic}
                onChange={(e) => setTraining({ ...training, isPublic: e.target.checked })}
                className="form-checkbox text-yellow-400 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Сделать тренировку публичной (доступна в библиотеке и у всех добавленных клиентов)</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Упражнения</h2>
            <button type="button" onClick={addExercise} className="btn-secondary text-sm">
              + Добавить упражнение
            </button>
          </div>

          {training.exercises.map((exercise, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-black">Упражнение {index + 1}</h3>
                {training.exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название упражнения *</label>
                  <input
                    type="text"
                    placeholder="Например: Жим штанги лежа"
                    className="input-field"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Подходы</label>
                    <input
                      type="number"
                      placeholder="3"
                      className="input-field text-sm"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Повторения</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="input-field text-sm"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Вес (кг)</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="input-field text-sm"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ссылка на видео (YouTube/Vimeo)</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="input-field text-sm"
                      value={exercise.videoUrl || ''}
                      onChange={(e) => updateExercise(index, 'videoUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ссылка на изображение</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="input-field text-sm"
                      value={exercise.imageUrl || ''}
                      onChange={(e) => updateExercise(index, 'imageUrl', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate('/trainer/trainings')} className="btn-secondary">
            Отмена
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Сохранение...' : (id ? 'Сохранить изменения' : 'Создать тренировку')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTraining;
