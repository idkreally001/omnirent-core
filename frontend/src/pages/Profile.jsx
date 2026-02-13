import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Calendar, LogOut, Trash2, ShieldAlert, Key, Package } from 'lucide-react';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);

useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await api.get('/user/profile');
            setUser(res.data);
        } catch (err) { navigate('/login'); }
    };

    const fetchMyItems = async () => {
        try {
            const res = await api.get('/items/mine/all');
            setMyItems(res.data);
        } catch (err) { console.error("Error fetching your items"); }
    };

    fetchProfile();
    fetchMyItems();
}, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/delete-account', { data: { password: deletePassword } });
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    try {
        await api.delete(`/items/${itemId}`);
        setMyItems(myItems.filter(item => item.id !== itemId)); // Update UI instantly
    } catch (err) {
        alert("Failed to delete item");
    }
};

  if (!user) return <div className="text-center mt-20">Loading Account...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{user.full_name}</h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Verified Member</p>
            
            <div className="mt-8 space-y-2">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-gray-600 font-bold p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100 text-sm">
                    <LogOut size={16} /> Logout
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold p-3 rounded-xl hover:bg-red-50 transition text-sm">
                    <Trash2 size={16} /> Delete Account
                </button>
            </div>
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

          <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
    <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black">My Active Listings</h3>
        <span className="text-sm font-bold text-gray-400">{myItems.length} items</span>
    </div>

    {myItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <Package className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-400 font-bold">You haven't listed anything yet.</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-blue-600 font-black">{item.price_per_day}₺ / day</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    )}
</div>

          {/* Quick Action Listing Card */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-lg shadow-blue-100">
            <div>
              <h3 className="text-xl font-black text-white">Ready to list?</h3>
              <p className="text-blue-100 opacity-80">Make money from your idle tools.</p>
            </div>
            <button onClick={() => navigate('/list-item')} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-50 transition">
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldAlert size={24} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-6 font-medium">This action is permanent. Enter your password to confirm account deletion.</p>
            
            {error && <p className="text-red-600 text-xs font-bold mb-4">{error}</p>}
            
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-red-500 transition"
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
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