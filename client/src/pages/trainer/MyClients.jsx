
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const MyClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProgress, setClientProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientProgress(selectedClient._id);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients/trainer/clients');
      // Фильтруем, чтобы исключить самого себя
      const filteredClients = response.data.filter(client => client._id !== user?._id);
      console.log('Мои клиенты:', filteredClients);
      setClients(filteredClients);
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientProgress = async (clientId) => {
    try {
      const response = await api.get(`/progress/client/${clientId}`);
      setClientProgress(response.data);
    } catch (error) {
      console.error('Ошибка загрузки прогресса:', error);
    }
  };

  const startChat = (clientId) => {
    navigate('/chat', { state: { selectedUserId: clientId } });
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Мои клиенты ({clients.length})</h1>
      
      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">У вас пока нет клиентов</p>
          <p className="text-gray-400 mt-2">Клиенты добавят вас через раздел "Найти тренера"</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {clients.map(client => (
            <div key={client._id} className="card hover:scale-105 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="avatar avatar-yellow w-16 h-16 text-2xl">
                  {client.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-black">{client.name}</h3>
                  <p className="text-sm text-gray-600">
                    Email: {client.email}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Зарегистрирован: {new Date(client.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Цель: {client.profile?.goals || 'Не указана'}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => startChat(client._id)}
                      className="btn-primary text-sm"
                    >
                      💬 Написать
                    </button>
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="btn-secondary text-sm"
                    >
                      📊 Прогресс
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-yellow-400 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">
                Прогресс: {selectedClient.name}
              </h2>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {clientProgress.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Нет данных о прогрессе</p>
            ) : (
              <div className="space-y-4">
                {clientProgress.map(entry => (
                  <div key={entry._id} className="bg-gray-900 p-4 rounded-lg">
                    <p className="font-medium text-white">
                      {new Date(entry.date).toLocaleDateString('ru-RU')}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
                      <p>Вес: {entry.weight} кг</p>
                      <p>Жир: {entry.bodyFat}%</p>
                      <p>Грудь: {entry.measurements?.chest} см</p>
                      <p>Талия: {entry.measurements?.waist} см</p>
                      <p>Бедра: {entry.measurements?.hips} см</p>
                      <p>Руки: {entry.measurements?.arms} см</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClients;
