import { User, Star, CheckCircle2, LogOut, Trash2 } from 'lucide-react';

export default function ProfileSidebar({ user, onAddFunds, onVerifyClick, onLogout, onDeleteClick }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center sticky top-24">
      <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
        <User size={48} />
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.full_name}</h2>

      <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
        <Star size={14} fill="currentColor" />
        <span className="text-sm font-black text-gray-700">
          {Number(user.avg_rating || 0).toFixed(1)}
        </span>
        <span className="text-[10px] text-gray-400 font-bold ml-1">
          ({user.review_count || 0} reviews)
        </span>
      </div>
      
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
            onClick={onVerifyClick}
            className="mt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-all animate-pulse"
          >
            Verify Now
          </button>
        </div>
      )}
      
      {/* WALLET SECTION */}
      <div className="mt-6 p-4 bg-gray-900 rounded-2xl text-white shadow-lg shadow-gray-200">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Available Balance</p>
        <div className="text-3xl font-black text-green-400">{Number(user.balance || 0).toFixed(2)}₺</div>
        
        {Number(user.pending_escrow) > 0 && (
          <div className="mt-3 py-2 border-t border-gray-700/50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Pending Escrow</p>
            <div className="text-lg font-black text-yellow-500">{Number(user.pending_escrow || 0).toFixed(2)}₺</div>
          </div>
        )}

        <button 
          onClick={onAddFunds}
          className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <span>+ Add Funds</span>
        </button>
      </div>
      
      <div className="mt-8 space-y-2">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-600 font-bold p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100 text-sm">
          <LogOut size={16} /> Logout
        </button>
        <button onClick={onDeleteClick} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold p-3 rounded-xl hover:bg-red-50 transition text-sm">
          <Trash2 size={16} /> Delete Account
        </button>
      </div>
    </div>
  );
}