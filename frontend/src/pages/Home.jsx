import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Package, ArrowRight, Tags, Navigation } from 'lucide-react';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/items');
        // Show only the latest 3 items for the homepage feed
        setFeaturedItems(res.data.slice(0, 3));
      } catch (err) { console.error("Home feed error:", err); }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-24 py-12">
      {/* HERO SECTION - Clean, Functional, Minimalist */}
      <div className="max-w-4xl mx-auto px-4 text-center mt-8 mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
          Access the equipment you need.
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10">
          A peer-to-peer neighborhood catalog for borrowing tools, electronics, and gear securely.
        </p>

        {/* Big functional search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-32 py-5 bg-white border border-gray-200 rounded-3xl leading-5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg transition-all"
            placeholder="Search for drills, cameras, camping gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-3 top-3 bottom-3 bg-gray-900 text-white px-6 rounded-2xl font-bold hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/browse" className="text-gray-500 hover:text-gray-900 font-bold transition-colors flex items-center gap-2">
            <Navigation size={18} /> Browse Catalog
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/list-item" className="text-gray-500 hover:text-gray-900 font-bold transition-colors flex items-center gap-2">
            <Tags size={18} /> List an Item
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 pt-20">
        {/* RECENTLY ADDED FEED */}
        <div className="space-y-10">
          <div className="flex justify-between items-end border-b border-gray-100 pb-6">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fresh on the Market</h2>
               <p className="text-gray-500 font-medium mt-2">Discover the latest listings added by users.</p>
            </div>
            <Link to="/browse" className="hidden sm:flex text-blue-600 font-bold items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredItems.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <Package className="mx-auto text-gray-300 mb-4" size={48} />
               <p className="text-gray-500 font-medium">No items listed yet. Check back later!</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {featuredItems.map((item) => (
                 <div key={item.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                     <div className="h-56 bg-gray-50 overflow-hidden relative">
                         <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase text-gray-600 border border-gray-100">
                             {item.category}
                         </div>
                         {item.image_url ? (
                             <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>
                         )}
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                         <h3 className="font-bold text-xl text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                         <div className="flex-grow mb-6">
                           <p className="text-2xl font-black text-gray-900">{(item.price_per_day / 100).toFixed(2)}₺ <span className="text-sm text-gray-400 font-medium">/ day</span></p>
                         </div>
                         <button 
                             onClick={() => navigate(`/item/${item.id}`)}
                             className="w-full bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                         >
                             View Details
                         </button>
                     </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}