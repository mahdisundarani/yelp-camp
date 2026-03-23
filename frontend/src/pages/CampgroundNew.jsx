import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CampgroundNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
  });
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
        submitData.append(`campground[${key}]`, formData[key]);
    });

    if (images) {
      Array.from(images).forEach((file) => {
        submitData.append('image', file); // The backend multer expects 'image'
      });
    }

    try {
      const res = await axios.post('http://localhost:3000/campgrounds', submitData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/campgrounds/${res.data.campground._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campground');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in">
      <h1 className="text-4xl font-extrabold text-white text-glow mb-8 text-center">Add New Campground</h1>
      
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}
      
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input 
            type="text" name="title" required
            value={formData.title} onChange={handleChange}
            className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all" 
            placeholder="Yosemite Valley"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input 
              type="text" name="location" required
              value={formData.location} onChange={handleChange}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all" 
              placeholder="California, USA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
            <input 
              type="number" name="price" required min="0" step="0.01"
              value={formData.price} onChange={handleChange}
              className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all" 
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images</label>
           <input 
            type="file" multiple name="image" onChange={handleFileChange}
            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-base-border file:text-white hover:file:bg-neon-blue hover:file:text-black transition-all"
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea 
            name="description" required rows="5"
            value={formData.description} onChange={handleChange}
            className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all" 
            placeholder="A beautiful camp site..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 text-lg font-bold text-black bg-neon-blue rounded-sm glow-blue hover:bg-white hover:text-black transition-all disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Campground'}
        </button>
      </form>
    </div>
  );
}
