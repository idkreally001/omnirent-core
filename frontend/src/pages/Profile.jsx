import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  User, Mail, Calendar, LogOut, Trash2, 
  ShieldAlert, Package, X, ShoppingBag, Clock, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // MODAL & FRICTION STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false); // NEW: Verify modal state
  const [deletePassword, setDeletePassword] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // DATA STATES
  const [myItems, setMyItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [myLendings, setMyLendings] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [tcInput, setTcInput] = useState(''); // NEW: TC input state
  
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, itemsRes, rentalsRes, lendingsRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/items/mine/all'),
          api.get('/rentals/my-rentals'),
          api.get('/rentals/my-lendings')
        ]);
        setUser(profileRes.data);
        setMyItems(itemsRes.data);
        setMyRentals(rentalsRes.data);
        setMyLendings(lendingsRes.data);
      } catch (err) { 
        console.error("Session expired or fetch failed", err);
        window.location.href = '/login'; 
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  // --- ACTIONS ---

  const handleAddFunds = async () => {
    try {
      await api.post('/user/add-funds', { amount: 500 });
      setUser(prev => ({ ...prev, balance: Number(prev.balance) + 500 }));
      showToast("500₺ added to wallet!");
    } catch (err) {
      showToast("Failed to add funds", "error");
    }
  };

  const handleVerifyIdentity = async () => {
    if (tcInput.length !== 11) {
        return showToast("TC Number must be exactly 11 digits.", "error");
    }

    setIsLoading(true);
    try {
        const res = await api.put('/user/verify', { tc_no: tcInput });
        
        // Success: Update local state immediately
        setUser(prev => ({ ...prev, tc_no: tcInput }));
        setShowVerifyModal(false);
        showToast(res.data.message);
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Verification failed";
        showToast(errorMsg, "error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return setError("Password is required to proceed.");
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    setIsLoading(true);
    try {
      await api.delete('/user/delete-account', { data: { password: deletePassword } });
      localStorage.clear();
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
      setIsLoading(false);
      setIsConfirmingDelete(false); 
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setMyItems(myItems.filter(item => item.id !== itemId));
      setItemToDelete(null);
      showToast("Listing archived successfully!"); 
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete item";
      showToast(errorMsg, "error");
    }
  };

  const handleReturn = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/return`);
      setMyRentals(prev => prev.map(r => 
        r.id === rentalId ? { ...r, status: 'returned_by_renter' } : r
      ));
      showToast("Return initiated! Waiting for owner confirmation.");
    } catch (err) {
      showToast(err.response?.data?.error || "Return failed", "error");
    }
  };

  const handleConfirmReceipt = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/confirm-receipt`);
      showToast("Item confirmed and back in inventory!");
      
      const [itemsRes, lendingsRes] = await Promise.all([
        api.get('/items/mine/all'),
        api.get('/rentals/my-lendings')
      ]);
      setMyItems(itemsRes.data);
      setMyLendings(lendingsRes.data);
    } catch (err) {
      showToast("Failed to confirm receipt", "error");
    }
  };

  // Filter Helpers
  const activeRentals = myRentals.filter(r => r.status === 'active' || r.status === 'returned_by_renter');
  const historyRentals = myRentals.filter(r => r.status === 'completed');

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
            
            {/* DYNAMIC VERIFIED BADGE & BUTTON */}
            {user.tc_no ? (
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-1 bg-blue-50 inline-block px-2 py-1 rounded-md flex items-center gap-1 mx-auto">
                <CheckCircle2 size={10} /> Verified Member
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 bg-gray-50 inline-block px-2 py-1 rounded-md">
                  Unverified Account
                </p>
                <button 
                  onClick={() => setShowVerifyModal(true)}
                  className="mt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-all animate-pulse"
                >
                  Verify Now
                </button>
              </div>
            )}
            
            {/* WALLET SECTION */}
            <div className="mt-6 p-4 bg-gray-900 rounded-2xl text-white shadow-lg shadow-gray-200">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Wallet Balance</p>
              <div className="text-3xl font-black text-green-400">{Number(user.balance || 0).toFixed(2)}₺</div>
              <button 
                onClick={handleAddFunds}
                className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>+ Add 500₺</span>
              </button>
            </div>
            
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
              <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{activeRentals.length} active</span>
            </div>

            {myRentals.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 font-bold text-sm">You haven't rented anything yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {activeRentals.length > 0 && (
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Currently Borrowing</h4>
                     {activeRentals.map(rental => (
                       <RentalCard key={rental.id} rental={rental} onReturn={() => handleReturn(rental.id)} isActive={true} />
                     ))}
                  </div>
                )}
                {historyRentals.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 border-t border-gray-100 pt-6">Rental History</h4>
                    {historyRentals.map(rental => (
                       <RentalCard key={rental.id} rental={rental} isActive={false} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* My Listings & Owner Dashboard */}
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
              <div className="grid grid-cols-1 gap-4">
                {myItems.map(item => (
                  <div key={item.id} className={`flex flex-col p-4 rounded-2xl border transition-all group ${item.rental_status === 'returned_by_renter' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors ${item.status === 'rented' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-blue-600'}`}>
                          <Package size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-blue-600 font-black">{item.price_per_day}₺/day</p>
                            {item.status === 'rented' && (
                              <span className="text-[8px] font-black uppercase bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                Rented
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {item.status === 'available' && (
                        <button 
                          onClick={() => setItemToDelete(item)} 
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    {item.status === 'rented' && (
                       <div className="mt-4 pt-4 border-t border-gray-100">
                          {item.rental_status === 'returned_by_renter' ? (
                            <div className="flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-2 text-orange-700 font-black text-[10px] uppercase">
                                    <AlertCircle size={14} /> Action Required
                                </div>
                                <button 
                                  onClick={() => handleConfirmReceipt(item.active_rental_id)}
                                  className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-orange-100 hover:bg-orange-700 transition"
                                >
                                  Confirm Receipt
                                </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center gap-2 text-gray-500 font-bold">
                                    <User size={12} />
                                    <span>Renter: {item.renter_name || 'User'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 font-bold">
                                    <Clock size={12} />
                                    <span>Due: {new Date(item.return_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                          )}
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lending History Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Lending History</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                  Total Earned: {myLendings.filter(l => l.status === 'completed').reduce((acc, curr) => acc + Number(curr.total_price), 0)}₺
                </span>
                <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  {myLendings.filter(l => l.status === 'completed').length} completed
                </span>
              </div>
            </div>

            {myLendings.filter(l => l.status === 'completed').length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <CheckCircle2 className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400 font-bold text-sm">No completed lendings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myLendings.filter(l => l.status === 'completed').map(lending => (
                  <div key={lending.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 opacity-75">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
                        {lending.image_url ? <img src={lending.image_url} alt="" className="object-cover w-full h-full" /> : <Package size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-500 text-sm line-clamp-1">{lending.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                          <User size={12} className="text-blue-400" />
                          Lent to {lending.renter_name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400">+{lending.total_price}₺</p>
                      <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Earned</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center relative">
            <button 
                onClick={() => setShowVerifyModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
            >
                <X size={20} />
            </button>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Trust Verification</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Enter your 11-digit TC number to earn your verification badge.</p>
            
            <input 
              type="text" 
              maxLength="11"
              placeholder="11-Digit TC Number" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center tracking-[0.2em]"
              onChange={(e) => setTcInput(e.target.value)}
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowVerifyModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button 
                onClick={handleVerifyIdentity} 
                disabled={isLoading || tcInput.length !== 11}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
            >
              <X size={20}/>
            </button>
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Final Warning</h3>
            <p className="text-gray-500 text-sm mb-6 font-medium">This action is permanent.</p>
            {error && <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-2 rounded-lg">{error}</p>}
            <input 
              type="password" 
              placeholder="Enter password to confirm" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-red-500 font-medium"
              onChange={(e) => { setDeletePassword(e.target.value); setIsConfirmingDelete(false); }}
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={isLoading || !deletePassword} className={`flex-1 py-4 rounded-2xl font-bold transition text-sm text-white disabled:opacity-50 ${isConfirmingDelete ? 'bg-orange-600 animate-pulse' : 'bg-red-600'}`}>
                {isLoading ? 'Deleting...' : isConfirmingDelete ? 'Are you sure?' : 'Delete Account'}
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
            <h3 className="text-2xl font-black text-gray-900 mb-2">Archive Listing?</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Archive <span className="text-gray-900 font-bold italic">"{itemToDelete.title}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button onClick={() => handleDeleteItem(itemToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-100">Archive</button>
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

function RentalCard({ rental, onReturn, isActive }) {
  const isPending = rental.status === 'returned_by_renter';
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPending ? 'bg-orange-50 border-orange-200 opacity-80' : isActive ? 'bg-gray-50 border-gray-100 hover:border-blue-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${isActive ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {rental.image_url ? <img src={rental.image_url} alt="" className="object-cover w-full h-full" /> : <ShoppingBag size={20} />}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm line-clamp-1">{rental.title}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
            {isPending ? <AlertCircle size={12} className="text-orange-500" /> : isActive ? <Clock size={12} /> : <CheckCircle2 size={12} />}
            {isPending ? <span className="text-orange-600">Pending Confirmation</span> : isActive ? `Return: ${new Date(rental.return_date).toLocaleDateString()}` : `Returned`}
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <div>
          <p className="text-xs font-black text-gray-900">{rental.total_price}₺</p>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${isActive ? 'text-green-600 bg-green-100' : 'text-gray-500 bg-gray-200'}`}>
            {isPending ? 'Pending' : isActive ? 'Active' : 'Completed'}
          </span>
        </div>
        {!isPending && isActive && (
          <button onClick={onReturn} className="text-[10px] font-black uppercase text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all shadow-sm">
            Return Item
          </button>
        )}
      </div>
    </div>
  );
}