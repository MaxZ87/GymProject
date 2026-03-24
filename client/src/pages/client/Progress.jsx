
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Progress = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progress, setProgress] = useState({
    weight: 0,
    bodyFat: 0,
    measurements: { chest: 0, waist: 0, hips: 0, arms: 0 },
    strength: []
  });
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    fetchProgress();
    fetchHistory();
  }, [selectedDate]);

  const fetchProgress = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/progress/date/${dateStr}`);
      if (response.data) {
        setProgress(response.data);
      } else {
        setProgress({
          weight: 0,
          bodyFat: 0,
          measurements: { chest: 0, waist: 0, hips: 0, arms: 0 },
          strength: []
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки прогресса:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/progress/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await api.post('/progress', {
        date: selectedDate,
        ...progress
      });
      fetchProgress();
      fetchHistory();
      alert('Прогресс сохранен!');
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      alert('Ошибка при сохранении прогресса');
    }
  };

  const updateProgress = async () => {
    try {
      await api.put(`/progress/${editingId}`, editingData);
      setEditingId(null);
      setEditingData(null);
      fetchHistory();
      alert('Прогресс обновлен!');
    } catch (error) {
      console.error('Ошибка обновления прогресса:', error);
      alert('Ошибка при обновлении прогресса');
    }
  };

  const deleteProgress = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await api.delete(`/progress/${id}`);
        fetchHistory();
        if (editingId === id) {
          setEditingId(null);
          setEditingData(null);
        }
        alert('Запись удалена');
      } catch (error) {
        console.error('Ошибка удаления прогресса:', error);
        alert('Ошибка при удалении записи');
      }
    }
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const hasProgress = (date) => {
    return history.some(h => {
      const hDate = new Date(h.date);
      return hDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      <h1 className="section-title">Мой прогресс</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-black">Календарь</h3>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="text-center text-sm text-gray-600">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map(date => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`w-8 h-8 rounded-full text-sm transition-all ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-yellow-400 text-black'
                    : hasProgress(date)
                    ? 'border-2 border-yellow-400 text-black'
                    : isToday(date)
                    ? 'border-2 border-white text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            * Желтая заливка - выбрано, желтая рамка - есть данные, белая рамка - сегодня
          </p>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-black">
            {selectedDate.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
              <input
                type="number"
                className="input-field"
                value={progress.weight}
                onChange={(e) => setProgress({...progress, weight: parseFloat(e.target.value)})}
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Процент жира (%)</label>
              <input
                type="number"
                className="input-field"
                value={progress.bodyFat}
                onChange={(e) => setProgress({...progress, bodyFat: parseFloat(e.target.value)})}
                step="0.1"
              />
            </div>

            <h4 className="font-semibold text-black mt-4">Замеры (см)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Грудь</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={progress.measurements.chest}
                  onChange={(e) => setProgress({
                    ...progress, 
                    measurements: {...progress.measurements, chest: parseFloat(e.target.value)}
                  })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Талия</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={progress.measurements.waist}
                  onChange={(e) => setProgress({
                    ...progress, 
                    measurements: {...progress.measurements, waist: parseFloat(e.target.value)}
                  })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Бедра</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={progress.measurements.hips}
                  onChange={(e) => setProgress({
                    ...progress, 
                    measurements: {...progress.measurements, hips: parseFloat(e.target.value)}
                  })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Руки</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={progress.measurements.arms}
                  onChange={(e) => setProgress({
                    ...progress, 
                    measurements: {...progress.measurements, arms: parseFloat(e.target.value)}
                  })}
                />
              </div>
            </div>

            <button onClick={saveProgress} className="btn-primary w-full mt-4">
              Сохранить
            </button>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-black">История прогресса</h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Нет данных о прогрессе</p>
          ) : (
            <div className="space-y-3">
              {history.map(entry => (
                <div key={entry._id} className="bg-gray-100 p-4 rounded-lg">
                  {editingId === entry._id && editingData ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Вес (кг)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.weight}
                            onChange={(e) => setEditingData({...editingData, weight: parseFloat(e.target.value)})}
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Жир (%)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.bodyFat}
                            onChange={(e) => setEditingData({...editingData, bodyFat: parseFloat(e.target.value)})}
                            step="0.1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Грудь (см)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.measurements?.chest || 0}
                            onChange={(e) => setEditingData({
                              ...editingData, 
                              measurements: {...editingData.measurements, chest: parseFloat(e.target.value)}
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Талия (см)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.measurements?.waist || 0}
                            onChange={(e) => setEditingData({
                              ...editingData, 
                              measurements: {...editingData.measurements, waist: parseFloat(e.target.value)}
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Бедра (см)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.measurements?.hips || 0}
                            onChange={(e) => setEditingData({
                              ...editingData, 
                              measurements: {...editingData.measurements, hips: parseFloat(e.target.value)}
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Руки (см)</label>
                          <input
                            type="number"
                            className="input-field text-sm"
                            value={editingData.measurements?.arms || 0}
                            onChange={(e) => setEditingData({
                              ...editingData, 
                              measurements: {...editingData.measurements, arms: parseFloat(e.target.value)}
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={updateProgress} className="btn-primary text-sm flex-1">
                          Сохранить
                        </button>
                        <button onClick={() => { setEditingId(null); setEditingData(null); }} className="btn-secondary text-sm">
                          Отмена
                        </button>
                        <button onClick={() => deleteProgress(entry._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                          Удалить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-black">
                          {new Date(entry.date).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Вес: {entry.weight} кг | Жир: {entry.bodyFat}% | 
                          Г: {entry.measurements?.chest} Т: {entry.measurements?.waist} 
                          Б: {entry.measurements?.hips} Р: {entry.measurements?.arms}
                        </p>
                      </div>
                      <button 
                        onClick={() => { 
                          setEditingId(entry._id); 
                          setEditingData(entry);
                        }}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
