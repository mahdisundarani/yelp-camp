import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const getFallbackImage = (id) => {
  return `https://picsum.photos/seed/${id || 'default'}/1200/800`;
};

export default function CampgroundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campground, setCampground] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0); 
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Edit Review State
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(3);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editBody, setEditBody] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campground and current user independently - me failing won't block the page
        const [campResult, meResult] = await Promise.allSettled([
          axios.get(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true }),
          axios.get('http://localhost:3000/me', { withCredentials: true })
        ]);

        if (campResult.status === 'fulfilled') {
          setCampground(campResult.value.data.campground);
        } else {
          setError(campResult.reason?.response?.data?.error || 'Failed to fetch campground');
        }

        if (meResult.status === 'fulfilled') {
          setCurrentUser(meResult.value.data.user);
        }
        // If /me fails we just leave currentUser as null (not logged in)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campground?')) {
      try {
        await axios.delete(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true });
        navigate('/campgrounds');
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:3000/campgrounds/${id}/reviews`, {
        review: { rating: reviewRating, body: reviewBody }
      }, { withCredentials: true });
      
      // Update campground state with the new review
      setCampground(prev => ({
        ...prev,
        reviews: [...prev.reviews,  { ...res.data.review, author: currentUser }] 
      }));
      setReviewBody('');
      setReviewRating(3);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:3000/campgrounds/${id}/reviews/${reviewId}`, { withCredentials: true });
        setCampground(prev => ({
          ...prev,
          reviews: prev.reviews.filter(r => r._id !== reviewId)
        }));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete review');
      }
    }
  };

  const handleEditInit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditBody(review.body);
  };

  const handleEditCancel = () => {
    setEditingReviewId(null);
  };

  const handleEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const res = await axios.put(`http://localhost:3000/campgrounds/${id}/reviews/${reviewId}`, {
        review: { rating: editRating, body: editBody }
      }, { withCredentials: true });
      
      setCampground(prev => ({
        ...prev,
        reviews: prev.reviews.map(r => r._id === reviewId ? { ...r, rating: res.data.review.rating, body: res.data.review.body } : r)
      }));
      setEditingReviewId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review');
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) return (
    <div className="animate-pulse space-y-4 max-w-4xl mx-auto mt-10">
      <div className="h-96 bg-base-800 rounded-md"></div>
      <div className="h-8 bg-base-800 rounded w-3/4"></div>
      <div className="h-4 bg-base-800 rounded w-1/4"></div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!campground) return <div className="text-gray-400 text-center mt-10">Campground not found.</div>;

  // Determine if the current logged-in user is the author
  const isAuthor = currentUser && campground.author && 
    (currentUser._id === campground.author._id || currentUser._id === campground.author);

  const authorName = campground.author?.username || 'Unknown';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 rounded-md hover:border-neon-blue transition-all group">
          {campground.images && campground.images.length > 0 ? (
            <img 
              src={campground.images[0].url} 
              alt={campground.title} 
              onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(campground._id); }}
              className="w-full h-96 object-cover rounded-sm mb-6 shadow-lg shadow-neon-blue/20" 
            />
          ) : (
            <img 
              src={getFallbackImage(campground._id)} 
              alt="Default Campground" 
              className="w-full h-96 object-cover rounded-sm mb-6 shadow-lg shadow-white/5 transition-all duration-500" 
            />
          )}
          <h1 className="text-4xl font-extrabold text-white text-glow mb-2">{campground.title}</h1>
          <p className="text-neon-green font-semibold text-xl mb-4">${campground.price}/night</p>
          <p className="text-gray-300 leading-relaxed mb-6">{campground.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm border-t border-base-border pt-4 mb-6">
            {/* Location */}
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-1.5 text-neon-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {campground.location}
            </div>
            {/* Author */}
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-1.5 text-neon-purple shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Submitted by <span className="ml-1 text-neon-purple font-semibold">{authorName}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link to="/campgrounds" className="px-6 py-2 bg-base-800 text-white border border-base-border rounded-sm hover:bg-base-900 transition-colors">
              ← Back
            </Link>
            {/* Only show Edit/Delete to the campground author */}
            {isAuthor && (
              <>
                <Link 
                  to={`/campgrounds/${id}/edit`}
                  className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-sm hover:bg-yellow-400 transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete} 
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-500 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-md">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-base-border pb-2">Leave a Review</h2>
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setReviewRating(star)}
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= (hoverRating || reviewRating)
                            ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                            : 'text-gray-600'
                        } transition-all duration-200`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-3 text-neon-blue font-bold text-lg w-8 text-center drop-shadow-md">
                    {hoverRating || reviewRating}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Comment</label>
                <textarea 
                  className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all resize-none" 
                  rows="4" 
                  placeholder="Share your thoughts..."
                  required
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={reviewSubmitting}
                className="w-full px-4 py-3 bg-neon-purple text-black font-extrabold text-lg tracking-wide rounded-sm glow-purple hover:bg-white hover:shadow-[0_0_20px_rgba(188,19,254,0.6)] transition-all duration-300 disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <p className="text-gray-400 text-sm">
              <Link to="/login" className="text-neon-blue hover:underline">Log in</Link> to leave a review.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Reviews <span className="text-gray-500 text-sm font-normal">({campground.reviews?.length || 0})</span></h2>
          {campground.reviews && campground.reviews.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {campground.reviews.map(review => {
                const isReviewAuthor = currentUser && review.author && (currentUser._id === review.author._id || currentUser._id === review.author);
                
                if (editingReviewId === review._id) {
                  return (
                    <div key={review._id} className="glass-panel p-5 rounded-md border-l-4 border-yellow-500 shadow-md">
                      <form onSubmit={(e) => handleEditSubmit(e, review._id)} className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-1 mb-2" onMouseLeave={() => setEditHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setEditHoverRating(star)}
                                onClick={() => setEditRating(star)}
                              >
                                <svg
                                  className={`w-6 h-6 ${
                                    star <= (editHoverRating || editRating)
                                      ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                                      : 'text-gray-600'
                                  } transition-all duration-200`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                            <span className="ml-2 text-yellow-400 font-bold w-4 text-center">
                              {editHoverRating || editRating}
                            </span>
                          </div>
                          <textarea 
                            className="w-full bg-base-900 border border-base-border rounded-sm p-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none" 
                            rows="3" 
                            required
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            type="submit" 
                            disabled={editSubmitting}
                            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-sm hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50"
                          >
                            {editSubmitting ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            type="button" 
                            onClick={handleEditCancel}
                            disabled={editSubmitting}
                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-sm hover:bg-gray-800 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  );
                }

                return (
                  <div key={review._id} className="glass-panel p-5 rounded-md border-l-4 border-neon-purple shadow-md hover:bg-white/5 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-neon-blue drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]'
                                : 'text-gray-700'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {review.author && (
                          <span className="text-xs font-medium text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-sm">
                            @{review.author.username}
                          </span>
                        )}
                        {isReviewAuthor && (
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditInit(review)}
                              className="text-xs text-yellow-500 hover:text-yellow-400 font-semibold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-xs text-red-500 hover:text-red-400 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.body}</p>
                  </div>
                );
              })}
            </div>
          ) : (
             <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
