import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center space-y-6 max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
          Everything you need, <span className="text-blue-600">just for some time.</span>
        </h1>
        <p className="text-xl text-gray-600 font-medium">
          Professional equipment rental from your neighbors. Secure, verified, and local.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/list-item" // FIXED: "Start Renting" means putting your items up
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100"
          >
            Start Renting
          </Link>
          <Link 
            to="/browse" 
            className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <FeatureCard icon={<ShieldCheck size={28}/>} title="Identity Verified" desc="Secure community verified via national identity standards." />
        <FeatureCard icon={<Zap size={28}/>} title="Instant Booking" desc="Skip the paperwork. Rent equipment with a single click." />
        <FeatureCard icon={<Clock size={28}/>} title="Flexible Duration" desc="Rent for an hour, a day, or a week. You set the timeline." />
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
      <p className="text-gray-500 font-medium">{desc}</p>
    </div>
  );
}