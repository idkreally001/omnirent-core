import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  User, Mail, Calendar, LogOut, Trash2, 
  ShieldAlert, Package, X, ShoppingBag, Clock 
} from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [myItems, setMyItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, itemsRes, rentalsRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/items/mine/all'),
          api.get('/rentals/my-rentals')
        ]);
        setUser(profileRes.data);
        setMyItems(itemsRes.data);
        setMyRentals(rentalsRes.data);
      } catch (err) { 
        console.error("Session expired or fetch failed", err);
        // Force reload to login if the session is dead
        window.location.href = '/login'; 
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    // Triggers a hard refresh to wipe all app state
    window.location.href = '/'; 
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return setError("Password is required");
    
    setIsLoading(true);
    try {
      await api.delete('/user/delete-account', { data: { password: deletePassword } });
      localStorage.clear();
      // Hard redirect after account deletion
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setMyItems(myItems.filter(item => item.id !== itemId));
      setItemToDelete(null);
      showToast("Listing removed successfully!"); 
    } catch (err) {
      showToast("Failed to delete item", "error");
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-gray-400 animate-pulse">Loading Account...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8 pb-20 px-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- Sidebar --- */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center sticky top-24">
            <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.full_name}</h2>
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

        {/* --- Main Content --- */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Account Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-black mb-6 text-gray-900">Account Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
              <InfoItem icon={<Calendar size={20}/>} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
            </div>
          </div>

          {/* Borrowed Items Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Borrowed Items</h3>
              <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{myRentals.length} active</span>
            </div>

            {myRentals.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 font-bold text-sm">You haven't rented anything yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRentals.map(rental => (
                  <div key={rental.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm overflow-hidden">
                        {rental.image_url ? <img src={rental.image_url} alt="" className="object-cover w-full h-full" /> : <ShoppingBag size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{rental.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                          <Clock size={12} /> Return: {new Date(rental.return_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900">{rental.total_price}₺</p>
                      <span className="text-[9px] font-black uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded">Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Listings Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">My Listings</h3>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{myItems.length} items</span>
            </div>

            {myItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <Package className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 font-bold text-sm">No items listed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Package size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-blue-600 font-black">{item.price_per_day}₺/day</p>
                          {item.status === 'rented' && (
                            <span className="text-[8px] font-black uppercase bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">Rented</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Fixed: Button moved outside of the inner flex info div */}
                    <button 
                      onClick={() => setItemToDelete(item)} 
                      disabled={item.status === 'rented'}
                      className={`p-2 transition ${item.status === 'rented' ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Card */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col sm:flex-row justify-between items-center shadow-lg shadow-blue-100 gap-4">
            <div>
              <h3 className="text-xl font-black">Want to earn?</h3>
              <p className="text-blue-100 text-sm opacity-80">List your tools and start earning today.</p>
            </div>
            <button onClick={() => navigate('/list-item')} className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-50 transition">
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS & NOTIFICATIONS (Unchanged logic, fixed minor spacing) --- */}
      {/* ... Account Delete Modal ... */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => { setShowDeleteModal(false); setError(''); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={20}/></button>
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-6 font-medium">This action is permanent. All data will be deleted.</p>
            
            {error && <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <input 
              type="password" 
              placeholder="Enter password to confirm" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-red-500 font-medium"
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button 
                onClick={handleDeleteAccount} 
                disabled={isLoading}
                className="flex-1 py-4 rounded-2xl font-bold transition text-sm bg-red-600 text-white disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Package size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Remove Listing?</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              Are you sure you want to remove <span className="text-gray-900 font-bold italic">"{itemToDelete.title}"</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm">Keep it</button>
              <button onClick={() => handleDeleteItem(itemToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-100">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1 leading-none">{label}</p>
        <p className="font-bold text-gray-800 leading-none truncate">{value}</p>
      </div>
    </div>
  );
}