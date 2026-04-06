import { X, ShieldAlert } from 'lucide-react';

export default function VerificationModal({ onClose, onVerify, isLoading, tcInput, setTcInput }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4 transition-all duration-300">
      <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-10 max-w-sm w-full shadow-2xl text-center relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors">
            <X size={24} />
        </button>
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <ShieldAlert size={32} />
        </div>
        <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Trust Verification</h3>
        <p className="text-text-secondary text-sm mb-8 font-black uppercase tracking-widest text-[10px]">Verify your identity to earn the community trust badge.</p>
        
        <input 
          type="text" 
          maxLength="11"
          placeholder="ENTER 11-DIGIT ID" 
          className="w-full p-5 bg-bg-primary border border-border-subtle rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-blue-600 font-black text-center tracking-[0.3em] text-text-primary placeholder:text-text-secondary/30 transition-all"
          onChange={(e) => setTcInput(e.target.value)}
        />
        
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-bg-primary text-text-secondary border border-border-subtle py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all">Cancel</button>
          <button 
            onClick={onVerify} 
            disabled={isLoading || tcInput.length !== 11}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all"
          >
            {isLoading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>
      </div>
    </div>
  );
}