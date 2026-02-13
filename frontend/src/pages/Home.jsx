import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Zap, ShieldCheck, Clock, Package, ArrowRight } from 'lucide-react';

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/items');
        // We only show the latest 3 items on the homepage
        setFeaturedItems(res.data.slice(0, 3));
      } catch (err) { console.error(err); }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-tight">
          Everything you need, <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">just for some time.</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          Professional equipment rental from your neighbors. Secure, verified, and local.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/list-item" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100">
            Start Renting
          </Link>
          <Link to="/browse" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition">
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard icon={<ShieldCheck size={28}/>} title="Identity Verified" desc="Secure community verified via national identity standards." />
        <FeatureCard icon={<Zap size={28}/>} title="Instant Booking" desc="Skip the paperwork. Rent equipment with a single click." />
        <FeatureCard icon={<Clock size={28}/>} title="Flexible Duration" desc="Rent for an hour, a day, or a week. You set the timeline." />
      </div>

      {/* LIVE FEED PREVIEW */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recently Added</h2>
          <Link to="/browse" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-48 bg-gray-50 overflow-hidden">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={40} /></div>
                    )}
                </div>
                <div className="p-6">
                    <h3 className="font-black text-xl text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-blue-600 font-black text-lg">{item.price_per_day}₺ <span className="text-xs text-gray-400 font-medium">/ day</span></p>
                    <button 
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="mt-4 w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition"
                    >
                        View Details
                    </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-md group">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}