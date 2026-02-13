import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Share2, User, ArrowLeft, Package, Calendar } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err); 
        // Optional: Redirect to browse if not found
        // navigate('/browse'); 
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!item) return <div className="text-center mt-20 font-bold text-gray-400">Loading Listing...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-6">
      <button onClick={() => navigate('/browse')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition mb-4">
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-2 gap-0">
        
        {/* Left: Image Area */}
        <div className="bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 min-h-[400px]">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-300">
                <Package size={80} className="mx-auto mb-2 opacity-50" />
                <p className="font-bold text-sm">No Image Provided</p>
            </div>
          )}
        </div>

        {/* Right: Info Area */}
        <div className="p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                {item.category || 'Tool'}
              </span>
              <button 
                onClick={handleShare}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                <Share2 size={16} /> {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{item.title}</h1>
            
            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600 font-medium bg-gray-50 p-3 rounded-2xl w-fit">
                    <User size={20} className="text-blue-500" /> 
                    <span>Listed by <span className="font-bold text-gray-900">{item.owner_name}</span></span>
                </div>
            </div>

            <p className="text-gray-500 leading-relaxed font-medium text-lg border-l-4 border-gray-200 pl-4">
                {item.description}
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-black uppercase mb-1">Daily Rate</p>
              <p className="text-4xl font-black text-blue-600">{item.price_per_day}₺</p>
            </div>
            <button 
                onClick={() => alert("Rent feature coming in Sprint 3!")}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition shadow-xl shadow-gray-200"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}