import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const getFallbackImage = (id) => {
  return `https://picsum.photos/seed/${id || 'default'}/800/600`;
};

export default function CampgroundsIndex() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const response = await axios.get('http://localhost:3000/campgrounds', { withCredentials: true });
        setCampgrounds(response.data.campgrounds);
      } catch (err) {
        setError(err.message || 'Failed to fetch campgrounds');
      } finally {
        setLoading(false);
      }
    };
    fetchCampgrounds();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue glow-blue"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-10">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-base-border pb-4 mb-8">
        <h1 className="text-4xl font-bold text-white text-glow">All Campgrounds</h1>
        <Link 
          to="/campgrounds/new" 
          className="px-6 py-2 bg-white text-black font-semibold rounded-sm hover:bg-neon-blue hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all"
        >
          Add Campground
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campgrounds.map(camp => (
          <div key={camp._id} className="glass-panel p-4 rounded-md hover:border-neon-blue transition-colors group flex flex-col h-full">
            {camp.images && camp.images.length > 0 ? (
              <img 
                src={camp.images[0].url} 
                alt={camp.title} 
                onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(camp._id); e.target.className="w-full h-48 object-cover rounded-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity" }}
                className="w-full h-48 object-cover rounded-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity" 
              />
            ) : (
              <img 
                src={getFallbackImage(camp._id)} 
                alt="Default Campground" 
                className="w-full h-48 object-cover rounded-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity" 
              />
            )}
            <h2 className="text-xl font-bold text-white mb-2">{camp.title}</h2>
            <p className="text-gray-400 mb-4 grow line-clamp-3">{camp.description}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-base-border/50">
              <span className="text-sm font-medium text-gray-400">{camp.location}</span>
              <span className="text-sm font-bold text-neon-green">${camp.price}/night</span>
            </div>
            <Link 
              to={`/campgrounds/${camp._id}`} 
              className="mt-4 block text-center py-2 w-full text-sm font-medium border border-neon-blue text-neon-blue rounded-sm hover:bg-neon-blue hover:text-black glow-blue transition-all"
            >
              View Details
            </Link>
          </div>
        ))}
        {campgrounds.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No campgrounds found. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  );
}
