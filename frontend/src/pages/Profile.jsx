import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Calendar, LogOut, Package } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setUser(res.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; // Refresh to clean Navbar state
  };

  if (!user) return <div className="text-center mt-20">Loading Account...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">{user.full_name}</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Verified Member</p>
          <button 
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 text-red-600 font-bold p-3 rounded-xl hover:bg-red-50 transition border border-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xl font-black mb-6">Account Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
            <InfoItem icon={<Calendar size={20}/>} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black">Ready to list?</h3>
            <p className="text-blue-100 opacity-80">Turn your idle tools into extra income.</p>
          </div>
          <button onClick={() => navigate('/list-item')} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-50 transition">
            Add New Item
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400">{label}</p>
        <p className="font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}