import { User, Star, CheckCircle2, LogOut, Trash2 } from 'lucide-react';

export default function ProfileSidebar({ user, onAddFunds, onVerifyClick, onLogout, onDeleteClick }) {
  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 text-center sticky top-24 transition-colors">
      <div className="w-24 h-24 bg-blue-100/50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4 border border-blue-600/10">
        <User size={48} />
      </div>
      
      <h2 className="text-2xl font-black text-text-primary leading-tight uppercase tracking-tight">{user.full_name}</h2>

      <div className="flex items-center justify-center gap-1.5 mt-2 text-amber-500">
        <Star size={14} fill="currentColor" />
        <span className="text-sm font-black text-text-primary">
          {Number(user.avg_rating || 0).toFixed(1)}
        </span>
        <span className="text-[10px] text-text-secondary font-black tracking-widest ml-1 lowercase">
          ({user.review_count || 0} reviews)
        </span>
      </div>
      
      {/* DYNAMIC VERIFIED BADGE & BUTTON */}
      {user.tc_no ? (
        <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-3 bg-blue-600/10 border border-blue-600/20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl mx-auto shadow-sm shadow-blue-500/10">
          <CheckCircle2 size={12} /> Verified Member
        </p>
      ) : (
        <div className="flex flex-col items-center mt-3">
          <p className="text-text-secondary font-black text-[9px] uppercase tracking-widest bg-bg-primary border border-border-subtle inline-block px-3 py-1.5 rounded-xl mb-2">
            Unverified Account
          </p>
          <button 
            onClick={onVerifyClick}
            className="w-full text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-600/10 hover:bg-blue-600 hover:text-white border border-blue-600/20 px-4 py-2.5 rounded-xl transition-all animate-pulse shadow-sm shadow-blue-500/10"
          >
            Verify Now
          </button>
        </div>
      )}
      
      {/* WALLET SECTION - Specialized Card */}
      <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-[2rem] text-white shadow-2xl shadow-blue-600/10 transition-transform hover:scale-[1.02] duration-300">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Available Balance</p>
        <div className="text-3xl font-black text-green-400 tracking-tighter">{Number(user.balance || 0).toFixed(2)}₺</div>
        
        {Number(user.pending_escrow) > 0 && (
          <div className="mt-4 py-3 border-t border-white/5">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pending Escrow</p>
            <div className="text-xl font-black text-amber-400">{Number(user.pending_escrow || 0).toFixed(2)}₺</div>
          </div>
        )}

        <button 
          onClick={onAddFunds}
          className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 hover:text-blue-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <span>+ Add Funds</span>
        </button>
      </div>
      
      <div className="mt-8 space-y-3">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-text-secondary font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl bg-bg-primary hover:bg-text-primary hover:text-bg-primary transition-all border border-border-subtle shadow-sm">
          <LogOut size={14} /> Logout
        </button>
        <button onClick={onDeleteClick} className="w-full flex items-center justify-center gap-2 text-red-500/80 font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 bg-red-500/5">
          <Trash2 size={14} /> Delete Account
        </button>
      </div>
    </div>
  );
}