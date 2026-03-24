
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Пароли не совпадают');
    }

    setError('');
    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-xl border-2 border-yellow-400">
        <div>
          <h2 className="text-center text-3xl font-bold text-yellow-400">Регистрация</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Или <Link to="/login" className="text-yellow-400 hover:text-yellow-300">войдите</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">{error}</div>}
          
          <div className="space-y-4">
            <input name="name" type="text" required className="input-field-dark" placeholder="Имя"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input name="email" type="email" required className="input-field-dark" placeholder="Email"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input name="password" type="password" required className="input-field-dark" placeholder="Пароль"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <input name="confirmPassword" type="password" required className="input-field-dark" placeholder="Подтвердите пароль"
              value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            
            <div className="flex space-x-4 text-gray-300">
              <label><input type="radio" name="role" value="client" checked={formData.role === 'client'} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} className="mr-2" /> Клиент</label>
              <label><input type="radio" name="role" value="trainer" checked={formData.role === 'trainer'}
                onChange={(e) => setFormData({...formData, role: e.target.value})} className="mr-2" /> Тренер</label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
