import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setCurrentUser(res.data.user);
      navigate('/campgrounds');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-fade-in">
      <div className="glass-panel p-10 rounded-md w-full max-w-md shadow-lg shadow-white/5 border border-base-border">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Log in to your YelpCamp account</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-sm mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              required 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 font-bold text-black bg-neon-blue rounded-sm glow-blue hover:bg-white transition-all duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-neon-blue hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
