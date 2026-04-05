import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { X, ShieldAlert, Package } from 'lucide-react';

// Sub Components
import ProfileSidebar from '../components/profile/ProfileSidebar';
import AccountDetails from '../components/profile/AccountDetails';
import BorrowedItems from '../components/profile/BorrowedItems';
import MyListings from '../components/profile/MyListings';
import LendingHistory from '../components/profile/LendingHistory';
import VerificationModal from '../components/profile/VerificationModal';
import ReviewModal from '../components/ReviewModal'; 
import UserReviews from '../components/profile/UserReviews';
import PaymentModal from '../components/profile/PaymentModal';
import ConditionUploadModal from '../components/profile/ConditionUploadModal';
import DisputeModal from '../components/profile/DisputeModal';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchParams, setSearchParams] = useSearchParams();
  
  // MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [evidenceRentalId, setEvidenceRentalId] = useState(null);
  const [evidenceAction, setEvidenceAction] = useState(null);
  const [activeReviewRental, setActiveReviewRental] = useState(null);
  const [disputeRentalId, setDisputeRentalId] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // FORM STATES
  const [deletePassword, setDeletePassword] = useState('');
  const [tcInput, setTcInput] = useState('');
  
  // STATUS STATES
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // DATA STATES
  const [myItems, setMyItems] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [myLendings, setMyLendings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchProfileData = async () => {
    try {
      const [profileRes, itemsRes, rentalsRes, lendingsRes, reviewsRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/items/mine/all'),
        api.get('/rentals/my-rentals'),
        api.get('/rentals/my-lendings'),
        api.get('/user/my-reviews')
      ]);
      setUser(profileRes.data);
      setMyItems(itemsRes.data);
      setMyRentals(rentalsRes.data);
      setMyLendings(lendingsRes.data);
      setMyReviews(reviewsRes.data);
    } catch (err) { 
      console.error("Session expired or fetch failed", err);
      // Removed hard redirect to /login to prevent infinite loops on 500 Server Errors. 
      // 401 Unauthorized errors are handled securely by the global Axios interceptor.
      showToast("System error: Could not fetch profile data.", "error");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const rateId = searchParams.get('rate');
    if (rateId && myRentals.length > 0) {
      const rentalToRate = myRentals.find(r => r.id === parseInt(rateId));
      if (rentalToRate) setActiveReviewRental(rentalToRate);
    }
  }, [searchParams, myRentals]);

  const handleReviewSuccess = (msg) => {
    showToast(msg);
    setSearchParams({}); 
    setActiveReviewRental(null);
    fetchProfileData();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  const handleAddFundsSuccess = async (amount) => {
    try {
      await api.post('/user/add-funds', { amount });
      setUser(prev => ({ ...prev, balance: Number(prev.balance) + amount }));
      setShowPaymentModal(false);
      showToast(`${amount}₺ added to balance!`);
    } catch (err) {
      showToast("Failed to process payment with our gateway.", "error");
    } finally {
      setIsLoading(false); // Clean up loading state coming from modal
    }
  };

  const handleVerifyIdentity = async () => {
    if (tcInput.length !== 11) {
        return showToast("TC Number must be exactly 11 digits.", "error");
    }
    setIsLoading(true);
    try {
        const res = await api.put('/user/verify', { tc_no: tcInput });
        setUser(prev => ({ ...prev, tc_no: tcInput }));
        setShowVerifyModal(false);
        showToast(res.data.message);
    } catch (err) {
        showToast(err.response?.data?.error || "Verification failed", "error");
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
      showToast(err.response?.data?.error || "Failed to delete item", "error");
    }
  };

  const handleInitiateReturn = (rentalId) => {
    setEvidenceRentalId(rentalId);
    setEvidenceAction('renter_return');
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

  const handleInitiateConfirmReceipt = (rentalId) => {
    setEvidenceRentalId(rentalId);
    setEvidenceAction('owner_confirm');
  };

  const handleEvidenceSuccess = async () => {
    if (evidenceAction === 'renter_return') {
       await handleReturn(evidenceRentalId);
    } else if (evidenceAction === 'owner_confirm') {
       await handleConfirmReceipt(evidenceRentalId);
    } else if (evidenceAction === 'renter_handover') {
       await handleConfirmHandover(evidenceRentalId);
    }
    setEvidenceRentalId(null);
    setEvidenceAction(null);
  };

  const handleConfirmReceipt = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/confirm-receipt`);
      showToast("Item confirmed and back in inventory!");
      fetchProfileData();
    } catch (err) {
      showToast("Failed to confirm receipt", "error");
    }
  };

  const handleInitiateHandover = (rentalId) => {
    setEvidenceRentalId(rentalId);
    setEvidenceAction('renter_handover');
  };

  const handleConfirmHandover = async (rentalId) => {
    try {
      await api.put(`/rentals/${rentalId}/confirm-handover`);
      showToast("Handover confirmed! Rental is now active.");
      fetchProfileData();
    } catch (err) {
      showToast(err.response?.data?.error || "Handover confirmation failed", "error");
    }
  };

  const handleDispute = (rentalId) => {
    setDisputeRentalId(rentalId);
    setShowDisputeModal(true);
  };

  const handleConfirmDispute = async (reason) => {
    setIsLoading(true);
    try {
      await api.post(`/rentals/${disputeRentalId}/dispute`, { reason });
      showToast("Dispute ticket opened. Admin will review the photo logs.");
      setShowDisputeModal(false);
      setDisputeRentalId(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to submit dispute", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-gray-400 animate-pulse">Loading Account...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-8 pb-20 px-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* --- Sidebar (Col 4) --- */}
        <div className="md:col-span-4 lg:col-span-3">
          <ProfileSidebar 
            user={user} 
            onAddFunds={() => setShowPaymentModal(true)} 
            onVerifyClick={() => setShowVerifyModal(true)} 
            onLogout={handleLogout} 
            onDeleteClick={() => setShowDeleteModal(true)} 
          />
        </div>

        {/* --- Main Dashboard Content (Col 8/9) --- */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {/* Top Row: Details */}
          <AccountDetails user={user} />
          
          {/* Main Grid: Active Business */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BorrowedItems 
              myRentals={myRentals} 
              onReturn={handleInitiateReturn} 
              onConfirmHandover={handleInitiateHandover}
              onDispute={handleDispute} 
            />
            <MyListings 
              myItems={myItems} 
              onItemDeleteClick={setItemToDelete} 
              onConfirmReceipt={handleInitiateConfirmReceipt} 
              onDispute={handleDispute}
            />
          </div>

          {/* Bottom Grid: Reputation & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserReviews reviews={myReviews} />
            <LendingHistory myLendings={myLendings} />
          </div>

          {/* Promotional Card */}
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col sm:flex-row justify-between items-center shadow-xl shadow-blue-100/50 gap-4">
            <div>
              <h3 className="text-2xl font-black">Ready to list something new?</h3>
              <p className="text-blue-100 text-sm opacity-80 mt-1 font-medium">Turn your idle tools into extra earnings today.</p>
            </div>
            <button onClick={() => navigate('/list-item')} className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg">
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS & NOTIFICATIONS --- */}
      
      {showPaymentModal && (
        <PaymentModal
           onClose={() => setShowPaymentModal(false)}
           onSuccess={handleAddFundsSuccess}
           isLoading={isLoading}
           setIsLoading={setIsLoading}
        />
      )}

      {showVerifyModal && (
        <VerificationModal 
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerifyIdentity}
          isLoading={isLoading}
          tcInput={tcInput}
          setTcInput={setTcInput}
        />
      )}

      {activeReviewRental && (
        <ReviewModal 
          rentalId={activeReviewRental.id}
          itemTitle={activeReviewRental.title}
          onClose={() => { setActiveReviewRental(null); setSearchParams({}); }}
          onSuccess={handleReviewSuccess}
        />
      )}

      {evidenceRentalId && (
        <ConditionUploadModal 
          rentalId={evidenceRentalId}
          stage={(evidenceAction === 'renter_return' || evidenceAction === 'owner_confirm') ? 'return' : 'handover'}
          onClose={() => { setEvidenceRentalId(null); setEvidenceAction(null); }}
          onSuccess={handleEvidenceSuccess}
        />
      )}

      {showDisputeModal && (
        <DisputeModal 
          onClose={() => { setShowDisputeModal(false); setDisputeRentalId(null); }}
          onSubmit={handleConfirmDispute}
          isLoading={isLoading}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative text-center">
            <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={20}/></button>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-6 mx-auto"><ShieldAlert size={32} /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Final Warning</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">This action is permanent and cannot be undone.</p>
            {error && <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
            <input type="password" placeholder="Confirm password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-red-500 font-medium" onChange={(e) => { setDeletePassword(e.target.value); setIsConfirmingDelete(false); }} />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={isLoading || !deletePassword} className={`flex-1 py-4 rounded-2xl font-bold transition text-sm text-white disabled:opacity-50 ${isConfirmingDelete ? 'bg-orange-600 animate-pulse' : 'bg-red-600'}`}>
                {isLoading ? 'Wait...' : isConfirmingDelete ? 'Delete?' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-6 mx-auto"><Package size={32} /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Archive Listing?</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Are you sure you want to archive <span className="text-gray-900 font-bold italic">"{itemToDelete.title}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-sm">Cancel</button>
              <button onClick={() => handleDeleteItem(itemToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-red-100">Archive</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className={`px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${toast.type === 'success' ? 'bg-gray-900 text-white border-gray-800' : 'bg-red-600 text-white border-red-500'}`}>
          {toast.type === 'success' ? <Package size={20} className="text-blue-400" /> : <ShieldAlert size={20} />}
          {toast.message}
        </div>
      </div>
    </div>
  );
}