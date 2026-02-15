import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Package, X, Clock, Filter, ArrowUpDown, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // DISCOVERY STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(2000);

  const navigate = useNavigate();
  const categories = ['All', 'Tools', 'Electronics', 'Camping', 'Sports', 'Party'];

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/items', {
          params: { 
            search: searchTerm, 
            category: category !== 'All' ? category : undefined, 
            sort, 
            maxPrice 
          },
          signal: controller.signal
        });
        setItems(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Discovery failed", err);
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchData, 400);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort(); // Cancels the request if components re-renders/unmounts
    };
  }, [searchTerm, category, sort, maxPrice]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-0 py-10">
      
      {/* FILTER CARD */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="What do you need today?" 
              className="w-full pl-12 pr-10 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Filter size={12} /> Max Price: <span className="text-blue-600">{maxPrice}₺</span>
              </label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Sort */}
          <div className="relative w-full lg:w-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                <ArrowUpDown size={16} />
            </div>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full lg:w-auto pl-11 pr-10 py-4 bg-gray-50 border-none rounded-2xl font-black text-xs uppercase tracking-wider text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-gray-50 pt-6">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        category === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* ITEMS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Curating for you...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center">
          <Package className="mx-auto text-gray-200 mb-6" size={80} />
          <p className="text-gray-900 font-black text-2xl mb-2">No matches found</p>
          <p className="text-gray-400 text-sm mb-8">Try expanding your price range or changing categories.</p>
          <button 
            onClick={() => { setSearchTerm(''); setCategory('All'); setMaxPrice(2000); }} 
            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="h-64 bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-[2.5rem] relative">
                {item.status === 'rented' && (
                  <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Clock size={14} /> BUSY
                  </div>
                )}
                
                <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-600 border border-gray-100">
                    {item.category}
                </div>

                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.status === 'rented' ? 'opacity-30 grayscale' : ''}`} 
                  />
                ) : (
                  <Package size={48} className="text-gray-200" />
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8">{item.description}</p>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Daily Rate</span>
                    <span className={`text-3xl font-black ${item.status === 'rented' ? 'text-gray-200' : 'text-blue-600'}`}>
                      {item.price_per_day}₺
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    {item.status !== 'rented' && (
                      <button 
                        onClick={() => navigate(`/messages?item=${item.id}&owner=${item.owner_id}`)}
                        className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                        title="Message Owner"
                      >
                        <MessageSquare size={20} />
                      </button>
                    )}

                    <button 
                      onClick={() => navigate(`/item/${item.id}`)}
                      disabled={item.status === 'rented'}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          item.status === 'rented' 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                          : 'bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200'
                      }`}
                    >
                      {item.status === 'rented' ? 'Unavailable' : 'Rent Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}