import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Calendar, LogOut, Trash2, ShieldAlert, Package, X } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);


  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

// Helper to trigger the toast
const showToast = (message, type = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
};
  
  // Account Delete States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // New: Double-check logic
  const [error, setError] = useState('');
  
  // Item Management States
  const [myItems, setMyItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null); // New: For custom item modal
  
  const navigate = useNavigate();

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
    // Phase 1: First click changes the button
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    // Phase 2: Second click executes the deletion
    try {
      await api.delete('/user/delete-account', { data: { password: deletePassword } });
      localStorage.clear();
      // Redirect to a clean landing state
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
      setIsConfirmingDelete(false); // Reset on error
    }
  };

  const handleDeleteItem = async (itemId) => {
  try {
    await api.delete(`/items/${itemId}`);
    setMyItems(myItems.filter(item => item.id !== itemId));
    setItemToDelete(null);
    
    // TRIGGER THE TOAST
    showToast("Listing removed successfully!"); 
  } catch (err) {
    showToast("Failed to delete item", "error");
  }
};

  if (!user) return <div className="text-center mt-20 font-bold text-gray-400 animate-pulse">Loading Account...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center sticky top-24">
            <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{user.full_name}</h2>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 bg-gray-50 inline-block px-2 py-1 rounded-md">Verified Member</p>
            
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
          {/* Account Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-black mb-6 text-gray-900">Account Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
              <InfoItem icon={<Calendar size={20}/>} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
            </div>
          </div>

          {/* Listings Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">My Active Listings</h3>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{myItems.length} items</span>
            </div>

            {myItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <Package className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 font-bold">You haven't listed anything yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-blue-600 font-black">{item.price_per_day}₺ / day</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setItemToDelete(item)}
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
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-lg shadow-blue-100 group">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Ready to list?</h3>
              <p className="text-blue-100 text-sm opacity-80 font-medium leading-tight">Turn your idle tools into extra income.</p>
            </div>
            <button onClick={() => navigate('/list-item')} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-50 transition transform group-hover:scale-105">
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Account Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 relative">
            <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition"><X size={20}/></button>
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">This action is permanent. All your data and listings will be deleted immediately.</p>
            
            {error && <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <input 
              type="password" 
              placeholder="Enter password to confirm" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); }} 
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className={`flex-1 py-4 rounded-2xl font-bold transition text-sm shadow-lg ${isConfirmingDelete ? 'bg-black text-white animate-pulse' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'}`}
              >
                {isConfirmingDelete ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Item Delete Modal (Replaces Browser Prompt) */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Package size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Remove Listing?</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium leading-relaxed">
              Are you sure you want to remove <span className="text-gray-900 font-bold italic">"{itemToDelete.title}"</span>? This cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition text-sm"
              >
                Keep it
              </button>
              <button 
                onClick={() => handleDeleteItem(itemToDelete.id)} 
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition text-sm shadow-lg shadow-red-100"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className={`px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${toast.type === 'success' ? 'bg-gray-900 text-white border-gray-800' : 'bg-red-600 text-white border-red-500'}`}>
          {toast.type === 'success' ? <Package size={18} className="text-blue-400" /> : <ShieldAlert size={18} />}
          {toast.message}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none mb-1">{label}</p>
        <p className="font-bold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
  );
}