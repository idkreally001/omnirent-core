import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Package, X, Clock, Filter, ArrowUpDown, MessageSquare, Star, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  // DISCOVERY STATES
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(2000);
  
  // Sync URL search params with local state when Nav search triggers
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);
  // Get current user to prevent self-interactions
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Admin global delete
  const handleDeleteItem = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("ADMIN ACTION: Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing. Active rentals may exist.");
    }
  };

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
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-0 py-10 transition-colors duration-300">
      
      {/* FILTER CARD */}
      <div className="bg-bg-secondary p-6 rounded-[2.5rem] border border-border-subtle shadow-xl shadow-blue-500/5 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="What do you need today?" 
              className="w-full pl-12 pr-10 py-4 bg-bg-primary border-none rounded-2xl font-bold text-text-primary focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest flex items-center gap-2">
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
              className="w-full h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-blue-600"
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
              className="w-full lg:w-auto pl-11 pr-10 py-4 bg-bg-primary border-none rounded-2xl font-black text-xs uppercase tracking-wider text-text-primary focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-border-subtle pt-6">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        category === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                        : 'bg-bg-primary text-text-secondary hover:bg-border-subtle'
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
           <p className="font-black text-text-secondary uppercase tracking-widest text-xs">Curating for you...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-bg-secondary border-2 border-dashed border-border-subtle rounded-[3rem] p-20 text-center">
          <Package className="mx-auto text-text-secondary opacity-30 mb-6" size={80} />
          <p className="text-text-primary font-black text-2xl mb-2">No matches found</p>
          <p className="text-text-secondary text-sm mb-8">Try expanding your price range or changing categories.</p>
          <button 
            onClick={() => { setSearchTerm(''); setCategory('All'); setMaxPrice(2000); }} 
            className="px-10 py-4 bg-text-primary text-bg-primary rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full overflow-hidden"
            >
              {/* Image Container */}
              <div className="h-64 bg-bg-primary flex items-center justify-center overflow-hidden relative">
                {item.status === 'rented' && (
                  <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Clock size={14} /> BUSY
                  </div>
                )}
                
                <div className="absolute top-6 right-6 z-10 bg-bg-secondary/90 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black uppercase text-text-secondary border border-border-subtle">
                    {item.category}
                </div>

                {item.owner_verified && item.owner_rating >= 4.5 && (
                  <div className="absolute bottom-6 left-6 z-10 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> SUPER OWNER
                  </div>
                )}

                {currentUser?.is_admin && (
                  <button 
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="absolute bottom-6 right-6 z-20 bg-red-50 text-red-600 p-2 rounded-xl border border-red-200 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    title="Force Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.status === 'rented' ? 'opacity-30 grayscale' : ''}`} 
                  />
                ) : (
                  <Package size={48} className="text-text-secondary opacity-30" />
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-text-primary mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                <p className="text-text-secondary text-sm font-medium line-clamp-2 mb-8">{item.description}</p>
                
                <div className="mt-auto pt-6 border-t border-border-subtle flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest block mb-1">Daily Rate</span>
                    <span className={`text-3xl font-black ${item.status === 'rented' ? 'text-text-secondary opacity-30' : 'text-blue-600'}`}>
                      {item.price_per_day}₺
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    {/* Only show Message button if not rented AND not owned by current user */}
                    {item.status !== 'rented' && item.owner_id !== currentUser?.id && (
                      <button 
                        onClick={() => navigate(`/messages?item=${item.id}&owner=${item.owner_id}`)}
                        className="p-4 rounded-2xl bg-bg-primary text-text-secondary hover:bg-text-primary hover:text-bg-primary transition-all active:scale-95"
                        title="Message Owner"
                      >
                        <MessageSquare size={20} />
                      </button>
                    )}

                    <button 
                      onClick={() => navigate(`/item/${item.id}`)}
                      // Disable Rent button if rented OR owned by current user
                      disabled={item.status === 'rented' || item.owner_id === currentUser?.id}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          (item.status === 'rented' || item.owner_id === currentUser?.id)
                          ? 'bg-bg-primary text-text-secondary opacity-30 cursor-not-allowed' 
                          : 'bg-text-primary text-bg-primary hover:bg-blue-600 hover:shadow-lg'
                      }`}
                    >
                      {item.status === 'rented' ? 'Busy' : item.owner_id === currentUser?.id ? 'Own' : 'Rent'}
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