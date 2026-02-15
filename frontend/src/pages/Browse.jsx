import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Package, X, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // DISCOVERY STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(2000); // Default high ceiling

  const navigate = useNavigate();
  const categories = ['All', 'Tools', 'Electronics', 'Camping', 'Sports', 'Party'];

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Updated call to include sorting and price filtering
        const res = await api.get(
          `/items?search=${searchTerm}&category=${category}&sort=${sort}&maxPrice=${maxPrice}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Discovery failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category, sort, maxPrice]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-0">
      
      {/* ADVANCED SEARCH HEADER */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
        
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Text Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="What do you need today?" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <Filter size={12} /> Max Price: {maxPrice}₺
              </label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Sort Dropdown */}
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
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-gray-50 pt-6">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        category === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* GRID SECTION (Updated with Price logic) */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Organizing the shelf...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] p-20 text-center">
          <Package className="mx-auto text-gray-200 mb-6" size={64} />
          <p className="text-gray-400 font-black text-xl mb-2">Nothing found here.</p>
          <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or price range.</p>
          <button onClick={() => { setSearchTerm(''); setCategory('All'); setMaxPrice(2000); }} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase transition hover:bg-blue-600">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden flex flex-col h-full">
              
              <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-50 relative">
                {item.status === 'rented' && (
                  <div className="absolute top-6 left-6 z-10 bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                    <Clock size={12} />
                    Rented
                  </div>
                )}
                
                <div className="absolute top-6 right-6 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-gray-900 shadow-md">
                    {item.category}
                </div>

                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${item.status === 'rented' ? 'opacity-40 grayscale' : ''}`} 
                  />
                ) : (
                  <Package size={48} className="text-gray-200" />
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-8 line-clamp-2 font-medium flex-grow leading-relaxed">{item.description}</p>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Daily Rate</p>
                    <p className={`text-3xl font-black ${item.status === 'rented' ? 'text-gray-300' : 'text-blue-600'}`}>
                      {item.price_per_day}₺
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/item/${item.id}`)}
                    disabled={item.status === 'rented'}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                        item.status === 'rented' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200'
                    }`}
                  >
                    {item.status === 'rented' ? 'Rented' : 'View'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}