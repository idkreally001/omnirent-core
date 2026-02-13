import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Tag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.rows || res.data); // Adjust based on your backend return structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items", err);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="text-center mt-20 font-bold text-gray-400">Loading Marketplace...</div>;

  return (
    <div className="space-y-8">
      {/* ... Header Section ... */}

      {items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-bold text-xl">No items listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
              
              {/* IMAGE SECTION - UPDATED */}
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-50">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Package size={48} className="text-gray-300" />
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium flex-grow">{item.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Per Day</p>
                    <p className="text-2xl font-black text-blue-600">{item.price_per_day}₺</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/item/${item.id}`)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-gray-200"
                  >
                    View Details
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