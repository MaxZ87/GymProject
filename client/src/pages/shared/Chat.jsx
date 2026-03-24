
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchAllData();
    
    const selectedUserId = location.state?.selectedUserId;
    if (selectedUserId) {
      setTimeout(() => {
        const foundConversation = conversations.find(c => c.user._id === selectedUserId);
        if (foundConversation) {
          setSelectedChat(foundConversation);
          fetchMessages(selectedUserId);
        } else {
          fetchUserAndStartChat(selectedUserId);
        }
      }, 500);
    }
    
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (selectedChat) {
        fetchMessages(selectedChat.user._id);
      }
      fetchConversations();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.user._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchConversations(),
        fetchUnreadCount()
      ]);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/chat/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Ошибка загрузки уведомлений:', error);
      }
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  };

  const fetchUserAndStartChat = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      const newConversation = { user: response.data, lastMessage: null, unread: false };
      setConversations([newConversation, ...conversations]);
      setSelectedChat(newConversation);
      fetchMessages(userId);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/chat/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await api.post(`/chat/${selectedChat.user._id}`, {
        content: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations();
      fetchUnreadCount();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  if (loading) {
    return <div className="text-center text-yellow-400">Загрузка чата...</div>;
  }

  return (
    <div className="h-[calc(100vh-200px)] flex">
      <div className="w-80 bg-black border-r-2 border-yellow-400 overflow-y-auto">
        <div className="p-4 border-b-2 border-yellow-400">
          <h3 className="text-yellow-400 font-bold">Активные чаты</h3>
          <p className="text-gray-500 text-xs mt-1">Ваши диалоги с пользователями</p>
        </div>

        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Нет активных чатов</p>
              <p className="text-gray-500 text-xs mt-2">Начните диалог из профиля пользователя</p>
            </div>
          ) : (
            conversations.map(chat => (
              <div
                key={chat.user._id}
                onClick={() => {
                  setSelectedChat(chat);
                  fetchMessages(chat.user._id);
                }}
                className={`flex items-center space-x-3 p-3 hover:bg-gray-800 cursor-pointer rounded-lg transition-all mb-1 ${
                  selectedChat?.user._id === chat.user._id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="avatar avatar-yellow w-10 h-10">
                  {chat.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium truncate text-sm">{chat.user.name}</p>
                    {chat.unread && (
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {chat.user.role === 'trainer' ? 'Тренер' : 'Клиент'}
                  </p>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-900">
        {selectedChat ? (
          <>
            <div className="p-4 bg-black border-b-2 border-yellow-400">
              <div className="flex items-center space-x-3">
                <div className="avatar avatar-yellow w-10 h-10">
                  {selectedChat.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-yellow-400">{selectedChat.user.name}</h2>
                  <p className="text-xs text-gray-400">{selectedChat.user.role === 'trainer' ? 'Тренер' : 'Клиент'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-center">Нет сообщений. Напишите первое сообщение!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className="flex flex-col">
                    <p className="text-xs text-gray-400 mb-1">
                      {msg.senderId._id === user._id ? 'Вы' : msg.senderId.name}
                    </p>
                    <div className={`flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.senderId._id === user._id
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black border-t-2 border-yellow-400">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Введите сообщение..."
                  className="flex-1 input-field-dark"
                />
                <button onClick={sendMessage} className="btn-primary">
                  Отправить
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Выберите чат для начала общения</p>
              <p className="text-gray-500 text-sm">Перейдите в профиль пользователя, чтобы начать диалог</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
