import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
import api from '../api/axios';
import { 
  Share2, User, ArrowLeft, Package, CheckCircle2, Star // Added Star
} from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [days, setDays] = useState(1);
  const [isRenting, setIsRenting] = useState(false);
  const [rentedSuccess, setRentedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };
    fetchItem();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRent = async () => {
    setIsRenting(true);
    try {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + parseInt(days));

      await api.post('/rentals', {
        itemId: item.id,
        returnDate: returnDate.toISOString(),
        totalPrice: item.price_per_day * days
      });

      setRentedSuccess(true);
      setTimeout(() => navigate('/profile'), 2500);
    } catch (err) {
      alert(err.response?.data?.error || "Rental failed. Is the item still available?");
      setIsRenting(false);
    }
  };

  if (!item) {
    return <div className="text-center mt-20 font-bold text-gray-400">Loading Listing...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pb-12 space-y-6">
      <button 
        onClick={() => navigate('/browse')} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition mb-4"
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-2">
        
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
          {rentedSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900">Rental Confirmed!</h2>
              <p className="text-gray-500 font-medium">Redirecting you to your dashboard...</p>
            </div>
          ) : (
            <>
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
                
                <p className="text-gray-500 leading-relaxed font-medium text-lg border-l-4 border-gray-200 pl-4 mb-8">
                    {item.description}
                </p>

                {/* OWNER TRUST CARD */}
                <div className="mb-8 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black border border-gray-100 shadow-sm">
                        {item.owner_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 leading-none">{item.owner_name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-black text-gray-700">{Number(item.owner_rating || 0).toFixed(1)}</span>
                          <span className="text-[10px] text-gray-400">({item.owner_reviews || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/user/${item.owner_id}`} className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      View Profile
                    </Link>
                  </div>
                  {item.owner_tc && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-100/30 p-2 rounded-xl border border-blue-100/50">
                      <CheckCircle2 size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verified Identity</span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-blue-900 uppercase">Duration (Days)</label>
                    <input 
                      type="number" min="1" max="30" value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-20 p-2 rounded-xl border border-blue-200 text-center font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between text-blue-800 text-sm font-bold pt-2 border-t border-blue-100">
                    <span>Total Due</span>
                    <span>{(item.price_per_day * days).toFixed(2)}₺</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase mb-1">Daily Rate</p>
                  <p className="text-4xl font-black text-blue-600">{item.price_per_day}₺</p>
                </div>
                <button 
                  onClick={handleRent}
                  disabled={isRenting || item.status !== 'available'}
                  className={`px-10 py-4 rounded-2xl font-black text-lg transition shadow-xl ${
                    (isRenting || item.status !== 'available') ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200'
                  }`}
                >
                  {item.status !== 'available' ? 'Rented' : isRenting ? 'Processing...' : 'Rent Now'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}