import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      onLoginSuccess(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white mb-2">Log In</h1>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded px-3 py-2">
            {error}
          </p>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-gray-700 text-white border border-gray-600 rounded px-4 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-gray-700 text-white border border-gray-600 rounded px-4 py-2"
          required
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition">
          Log In
        </button>

        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;