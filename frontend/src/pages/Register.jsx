import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/register', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setCurrentUser(res.data.user);
      navigate('/campgrounds');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-fade-in">
      <div className="glass-panel p-10 rounded-md w-full max-w-md shadow-lg shadow-white/5 border border-base-border">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join YelpCamp today</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-sm mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              required 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 font-bold text-black bg-neon-purple rounded-sm glow-purple hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-neon-purple hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
