import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Share2, User, ArrowLeft, Package, CheckCircle2, Star, MessageSquare, ShieldCheck, Trash2
} from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get current user to check if they own the item
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [days, setDays] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  
  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays > 0 ? diffDays : 1);
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (new Date(newStart) >= new Date(endDate)) {
      const nextDay = new Date(new Date(newStart).getTime() + 86400000);
      setEndDate(nextDay.toISOString().split('T')[0]);
    }
  };
  const [isRenting, setIsRenting] = useState(false);
  const [rentedSuccess, setRentedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
        if (res.data.image_url) setActiveImage(res.data.image_url);
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

  const handleDelete = async () => {
    if (!window.confirm("ADMIN ACTION: Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/items/${id}`);
      navigate('/browse');
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing. Active rentals may exist.");
    }
  };

  const handleRent = async () => {
    if (!currentUser) {
      return navigate('/login');
    }
    
    setIsRenting(true);
    try {
      await api.post('/rentals', {
        itemId: item.id,
        startDate: new Date(startDate).toISOString(),
        returnDate: new Date(endDate).toISOString(),
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-400">Loading Listing...</p>
      </div>
    );
  }

  const isOwner = currentUser?.id === item.owner_id;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pb-12 space-y-6">
      <button 
        onClick={() => navigate('/browse')} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition mb-4"
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left: Image Area */}
        <div className="bg-gray-50 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 min-h-[400px]">
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {item.image_url ? (
              <img src={activeImage || item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" />
            ) : (
              <div className="text-center text-gray-300 z-10">
                  <Package size={80} className="mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-sm">No Image Provided</p>
              </div>
            )}
          </div>
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-gray-100 no-scrollbar">
              {item.image_urls.map((url, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(url)} 
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === url ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'}`}
                >
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info Area */}
        <div className="p-10 flex flex-col justify-between">
          {rentedSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-green-100">
                <CheckCircle2 size={56} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Reserved! 🤝</h2>
                <p className="text-gray-500 font-bold max-w-[300px] mx-auto text-sm leading-relaxed">
                  Funds are now in <span className="text-blue-600">Escrow</span>. Meet the owner to pick up the item and click <span className="text-gray-900">"Confirm Receipt"</span> in your dashboard once you have it.
                </p>
              </div>
              <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-pulse">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Redirecting to Dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                    {item.category || 'Tool'}
                  </span>
                  <div className="flex gap-2">
                    {currentUser?.is_admin && (
                      <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-[10px] font-bold px-3 py-2 rounded-xl transition bg-red-50 text-red-600 hover:bg-red-100"
                        title="Force Delete Listing"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button 
                      onClick={handleShare}
                      className={`flex items-center gap-2 text-[10px] font-bold px-3 py-2 rounded-xl transition ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      <Share2 size={14} /> {copied ? 'Link Copied!' : 'Share'}
                    </button>
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{item.title}</h1>
                
                <p className="text-gray-500 leading-relaxed font-medium text-lg border-l-4 border-gray-100 pl-5 mb-8">
                    {item.description}
                </p>

                {/* OWNER TRUST CARD */}
                <div className="mb-8 p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black border border-gray-100 shadow-sm">
                        {item.owner_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 leading-none">{item.owner_name}</h4>
                        <div className="flex items-center gap-1.5 mt-1.5 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-black text-gray-700">{Number(item.owner_rating || 0).toFixed(1)}</span>
                          <span className="text-[10px] text-gray-400 font-bold">({item.owner_reviews || 0} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/user/${item.owner_id}`} 
                      className="text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 transition-colors tracking-widest"
                    >
                      View Profile
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    {/* 💬 MESSAGE OWNER BUTTON (Inside the Card) */}
                    {!isOwner && (
                      <button 
                        onClick={() => {
                          if (!currentUser) return navigate('/login');
                          navigate(`/messages?item=${item.id}&owner=${item.owner_id}`)
                        }}
                        className="flex-1 px-4 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white bg-gray-900 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                      >
                        <MessageSquare size={16} />
                        <span>Send Message</span>
                      </button>
                    )}

                    {item.owner_verified && item.owner_rating >= 4.5 ? (
                      <div className="flex-[0.5] flex items-center justify-center gap-2 text-amber-600 bg-amber-100/50 rounded-2xl border border-amber-200/50">
                        <Star size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Super Owner</span>
                      </div>
                    ) : item.owner_verified ? (
                      <div className="flex-[0.5] flex items-center justify-center gap-2 text-blue-600 bg-blue-100/30 rounded-2xl border border-blue-100/50">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Start Date</label>
                      <input 
                        type="date" value={startDate}
                        onChange={handleStartDateChange}
                        className="p-2 rounded-xl border border-blue-200 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-blue-900 uppercase tracking-widest">End Date</label>
                      <input 
                        type="date" value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 rounded-xl border border-blue-200 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-blue-800 text-sm font-bold pt-3 border-t border-blue-100/50">
                    <span className="opacity-60">Total Estimated Price</span>
                    <span className="text-lg font-black">{(item.price_per_day * days).toFixed(2)}₺</span>
                  </div>
                </div>
              </div>

              {/* ACTION AREA (Cleaned Up) */}
              <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Daily Rate</p>
                  <p className="text-4xl font-black text-blue-600 tracking-tight">{item.price_per_day}₺</p>
                  <div className="flex items-start gap-2 mt-4 max-w-[250px]">
                    <ShieldCheck size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-gray-400 font-bold leading-tight">
                      By renting, you agree to the <Link to="/usage" className="text-blue-600 hover:underline">Usage Agreement</Link> and Escrow Verification terms.
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleRent}
                  disabled={isRenting || item.status !== 'available' || isOwner}
                  className={`px-12 py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl active:scale-95 ${
                    (isRenting || item.status !== 'available' || isOwner) 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200'
                  }`}
                >
                  {isOwner ? 'Your Listing' : item.status !== 'available' ? 'Unavailable' : isRenting ? 'Processing...' : 'Rent Now'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}