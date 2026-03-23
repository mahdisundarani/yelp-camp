import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full text-center space-y-6 py-20 animate-fade-in">
      <h1 className="text-6xl font-extrabold tracking-tight text-white mb-4">
        Discover <span className="text-neon-blue text-glow">YelpCamp</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl">
        Jump right in and explore our many campgrounds. Feel free to share some of your own and comment on others!
      </p>
      <div className="pt-8">
        <Link 
          to="/campgrounds" 
          className="px-8 py-4 text-lg font-bold text-black bg-neon-blue rounded-sm glow-blue hover:bg-white transition-all duration-300"
        >
          View Campgrounds
        </Link>
      </div>
    </div>
  );
}
