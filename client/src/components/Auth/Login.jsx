
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
          <h2 className="text-center text-3xl font-bold text-yellow-400">Вход в FitLife Pro</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Или <Link to="/register" className="text-yellow-400 hover:text-yellow-300">зарегистрируйтесь</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              required
              className="input-field-dark"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="input-field-dark"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
