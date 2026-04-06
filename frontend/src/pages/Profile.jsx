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
    } else if (evidenceAction === 'owner_dispute') {
       // Photo evidence successfully logged! Now open text modal for the dispute reason.
       setDisputeRentalId(evidenceRentalId);
       setShowDisputeModal(true);
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

  const handleInitiateOwnerDispute = (rentalId) => {
    // Force the owner to take Post-Flight photos BEFORE they can submit the text dispute
    setEvidenceRentalId(rentalId);
    setEvidenceAction('owner_dispute');
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 transition-colors bg-bg-primary">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">Synchronizing Account...</p>
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
              onDispute={handleInitiateOwnerDispute}
            />
          </div>

          {/* Bottom Grid: Reputation & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserReviews reviews={myReviews} />
            <LendingHistory myLendings={myLendings} />
          </div>

          {/* Promotional Card */}
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col sm:flex-row justify-between items-center shadow-2xl shadow-blue-500/20 gap-6 transition-transform hover:scale-[1.01] duration-500">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Ready to earn more?</h3>
              <p className="text-blue-100 text-xs font-black uppercase tracking-widest opacity-80 mt-2">Turn your idle gear into high-growth assets.</p>
            </div>
            <button onClick={() => navigate('/list-item')} className="w-full sm:w-auto bg-white text-blue-600 px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-blue-50 transition-all shadow-xl active:scale-95">
              Add New Listing
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
          stage={(evidenceAction === 'renter_return' || evidenceAction === 'owner_confirm' || evidenceAction === 'owner_dispute') ? 'return' : 'handover'}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4 transition-all animate-in fade-in duration-300">
          <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-10 max-w-sm w-full shadow-2xl relative text-center">
            <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"><X size={24}/></button>
            <div className="w-16 h-16 bg-red-600/10 text-red-600 border border-red-600/20 rounded-3xl flex items-center justify-center mb-6 mx-auto"><ShieldAlert size={32} /></div>
            <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Final Warning</h3>
            <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase mb-10">This action is permanent and cannot be reversed.</p>
            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 bg-red-600/10 border border-red-600/20 p-4 rounded-xl">{error}</p>}
            <input type="password" placeholder="CONFIRM PASSWORD" className="w-full p-5 bg-bg-primary border border-border-subtle rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-red-600 font-bold text-text-primary placeholder:text-text-secondary/20 tracking-widest" onChange={(e) => { setDeletePassword(e.target.value); setIsConfirmingDelete(false); }} />
            <div className="flex gap-4">
              <button onClick={() => { setShowDeleteModal(false); setIsConfirmingDelete(false); setError(''); }} className="flex-1 bg-bg-primary text-text-secondary border border-border-subtle py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={isLoading || !deletePassword} className={`flex-1 py-4 rounded-2xl font-black transition-all text-[10px] uppercase tracking-widest text-white disabled:opacity-30 ${isConfirmingDelete ? 'bg-orange-600 animate-pulse' : 'bg-red-600 shadow-xl shadow-red-500/20 hover:bg-red-700'}`}>
                {isLoading ? 'Wait...' : isConfirmingDelete ? 'REALLY?' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4 transition-all duration-300">
          <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-10 max-w-sm w-full shadow-2xl text-center relative transition-all duration-300">
            <div className="w-16 h-16 bg-amber-600/10 text-amber-600 border border-amber-600/20 rounded-3xl flex items-center justify-center mb-6 mx-auto"><Package size={32} /></div>
            <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Archive Listing?</h3>
            <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase mb-10">Are you sure you want to archive <span className="text-text-primary italic">"{itemToDelete.title}"</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 bg-bg-primary text-text-secondary border border-border-subtle py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all">Cancel</button>
              <button onClick={() => handleDeleteItem(itemToDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">Archive</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className={`px-10 py-5 rounded-[2rem] shadow-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 border backdrop-blur-xl ${toast.type === 'success' ? 'bg-bg-secondary/90 text-text-primary border-blue-600/30' : 'bg-red-600 text-white border-red-500 shadow-red-500/20'}`}>
          {toast.type === 'success' ? <Package size={20} className="text-blue-600" /> : <ShieldAlert size={20} />}
          {toast.message}
        </div>
      </div>
    </div>
  );
}