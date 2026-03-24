
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Nutrition = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutrition, setNutrition] = useState({
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchNutrition();
    fetchHistory();
  }, [selectedDate]);

  const fetchNutrition = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/nutrition/date/${dateStr}`);
      if (response.data) {
        setNutrition(response.data);
      } else {
        setNutrition({ meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
      }
    } catch (error) {
      console.error('Ошибка загрузки питания:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/nutrition/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  const addMeal = async () => {
    if (!newMeal.name.trim()) {
      alert('Введите название приема пищи');
      return;
    }
    try {
      const response = await api.post('/nutrition/meal', {
        date: selectedDate,
        meal: newMeal
      });
      setNutrition(response.data);
      setShowForm(false);
      setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
      fetchHistory();
    } catch (error) {
      console.error('Ошибка добавления приема пищи:', error);
      alert('Ошибка при добавлении приема пищи');
    }
  };

  const updateMeal = async () => {
    try {
      const response = await api.put(`/nutrition/meal/${editingMeal._id}`, editingMeal);
      setNutrition(response.data);
      setEditingMeal(null);
      fetchHistory();
    } catch (error) {
      console.error('Ошибка обновления приема пищи:', error);
      alert('Ошибка при обновлении приема пищи');
    }
  };

  const deleteMeal = async (mealId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот прием пищи?')) {
      try {
        const response = await api.delete(`/nutrition/meal/${mealId}`);
        setNutrition(response.data);
        fetchHistory();
      } catch (error) {
        console.error('Ошибка удаления приема пищи:', error);
        alert('Ошибка при удалении приема пищи');
      }
    }
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const hasData = (date) => {
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
      <h1 className="section-title">Дневник питания</h1>

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
                    : hasData(date)
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
            {/* * Желтая заливка - выбрано, желтая рамка - есть данные, белая рамка - сегодня */}
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
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-700">Калории</span>
              <span className="font-semibold text-black">{nutrition.totalCalories} ккал</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all" 
                style={{ width: `${Math.min((nutrition.totalCalories / 2000) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <span className="text-xs text-gray-500">Белки</span>
                <p className="font-semibold text-black">{nutrition.totalProtein}г</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Жиры</span>
                <p className="font-semibold text-black">{nutrition.totalFat}г</p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500">Углеводы</span>
                <p className="font-semibold text-black">{nutrition.totalCarbs}г</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-black">Приемы пищи</h4>
            {nutrition.meals?.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Нет добавленных приемов пищи</p>
            ) : (
              nutrition.meals?.map(meal => (
                <div key={meal._id} className="bg-gray-100 p-3 rounded-lg">
                  {editingMeal && editingMeal._id === meal._id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="input-field text-sm"
                        value={editingMeal.name}
                        onChange={(e) => setEditingMeal({...editingMeal, name: e.target.value})}
                      />
                      <div className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          placeholder="ккал"
                          className="input-field text-sm"
                          value={editingMeal.calories}
                          onChange={(e) => setEditingMeal({...editingMeal, calories: parseInt(e.target.value)})}
                        />
                        <input
                          type="number"
                          placeholder="Б"
                          className="input-field text-sm"
                          value={editingMeal.protein}
                          onChange={(e) => setEditingMeal({...editingMeal, protein: parseInt(e.target.value)})}
                        />
                        <input
                          type="number"
                          placeholder="Ж"
                          className="input-field text-sm"
                          value={editingMeal.fat}
                          onChange={(e) => setEditingMeal({...editingMeal, fat: parseInt(e.target.value)})}
                        />
                        <input
                          type="number"
                          placeholder="У"
                          className="input-field text-sm"
                          value={editingMeal.carbs}
                          onChange={(e) => setEditingMeal({...editingMeal, carbs: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={updateMeal} className="btn-primary text-sm flex-1">Сохранить</button>
                        <button onClick={() => setEditingMeal(null)} className="btn-secondary text-sm">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-black">{meal.name}</p>
                        <p className="text-xs text-gray-500">
                          {meal.calories} ккал • Б:{meal.protein} • Ж:{meal.fat} • У:{meal.carbs}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingMeal(meal)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteMeal(meal._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {showForm ? (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Название приема пищи"
                className="input-field"
                value={newMeal.name}
                onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
              />
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  placeholder="ккал"
                  className="input-field text-sm"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value)})}
                />
                <input
                  type="number"
                  placeholder="Белки"
                  className="input-field text-sm"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({...newMeal, protein: parseInt(e.target.value)})}
                />
                <input
                  type="number"
                  placeholder="Жиры"
                  className="input-field text-sm"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({...newMeal, fat: parseInt(e.target.value)})}
                />
                <input
                  type="number"
                  placeholder="Углеводы"
                  className="input-field text-sm"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({...newMeal, carbs: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={addMeal} className="btn-primary flex-1">Добавить</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">Отмена</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-secondary w-full mt-4"
            >
              + Добавить прием пищи
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
