import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/logout', { withCredentials: true });
      setCurrentUser(null);
      navigate('/');
    } catch {
      // fail silently
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-base-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
          Yelp<span className="text-neon-blue text-glow">Camp</span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? "text-neon-blue font-medium text-glow transition-all" : "text-gray-400 hover:text-white transition-all"}
          >
            Home
          </NavLink>
          <NavLink 
            to="/campgrounds" 
            className={({isActive}) => isActive ? "text-neon-blue font-medium text-glow transition-all" : "text-gray-400 hover:text-white transition-all"}
          >
            Campgrounds
          </NavLink>
          {currentUser && (
            <NavLink 
              to="/campgrounds/new" 
              className={({isActive}) => isActive ? "text-neon-blue font-medium text-glow transition-all" : "text-gray-400 hover:text-white transition-all"}
            >
              New Campground
            </NavLink>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-sm text-gray-400">
                Hi, <span className="text-neon-purple font-semibold">{currentUser.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-medium text-white border border-base-border rounded-sm hover:border-red-500 hover:text-red-400 transition-all"
              >
                Logout
              </button>
            </>
          ) : currentUser === null ? (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 text-sm font-medium text-black bg-neon-blue rounded-sm glow-blue hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all">
                Register
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
