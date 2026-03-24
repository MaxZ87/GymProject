
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile: user?.profile || {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user._id}`, formData);
      updateUser(response.data);
      setIsEditing(false);
      alert('Профиль успешно обновлен!');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="section-title">Профиль пользователя</h1>
      
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="avatar avatar-yellow w-20 h-20 text-3xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-black">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold">
              {user.role === 'client' ? 'Клиент' : 'Тренер'}
            </span>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Отмена' : 'Редактировать'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {user.role === 'client' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.profile.age || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, age: parseInt(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Вес (кг)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.profile.weight || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, weight: parseFloat(e.target.value)}
                    })}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Рост (см)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.profile.height || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, height: parseInt(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цели</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.profile.goals || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, goals: e.target.value}
                    })}
                  />
                </div>
              </>
            )}

            {user.role === 'trainer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Специализация</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.profile.specialization || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, specialization: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.profile.location || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, location: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Опыт работы</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.profile.experience || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, experience: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Образование</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.profile.education || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, education: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.profile.bio || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      profile: {...formData.profile, bio: e.target.value}
                    })}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full">
              Сохранить изменения
            </button>
          </form>
        ) : (
          <div className="border-t border-gray-300 pt-6">
            <h3 className="font-semibold text-lg mb-4 text-yellow-600">Личная информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Имя</p>
                <p className="font-medium text-black">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-black">{user.email}</p>
              </div>
              
              {user.role === 'client' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Возраст</p>
                    <p className="font-medium text-black">{user.profile?.age || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Вес</p>
                    <p className="font-medium text-black">{user.profile?.weight || 'Не указан'} кг</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Рост</p>
                    <p className="font-medium text-black">{user.profile?.height || 'Не указан'} см</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Цели</p>
                    <p className="font-medium text-black">{user.profile?.goals || 'Не указаны'}</p>
                  </div>
                </>
              )}

              {user.role === 'trainer' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Специализация</p>
                    <p className="font-medium text-black">{user.profile?.specialization || 'Не указана'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Город</p>
                    <p className="font-medium text-black">{user.profile?.location || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Опыт</p>
                    <p className="font-medium text-black">{user.profile?.experience || 'Не указан'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Образование</p>
                    <p className="font-medium text-black">{user.profile?.education || 'Не указано'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">О себе</p>
                    <p className="font-medium text-black">{user.profile?.bio || 'Не указано'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
