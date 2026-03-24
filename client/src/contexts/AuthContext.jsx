
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Ошибка входа' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
