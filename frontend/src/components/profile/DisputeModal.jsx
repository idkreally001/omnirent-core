import { X, AlertTriangle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function DisputeModal({ onClose, onSubmit, isLoading }) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4 transition-all duration-300">
      <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-10 max-w-md w-full shadow-2xl relative transition-all duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-600/10 text-red-600 border border-red-600/20 rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Raise a Dispute</h3>
          <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase mb-8">
            Describe the issue clearly. Our administrators will review the evidence.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="relative">
              <div className="absolute top-5 left-5 text-text-secondary opacity-30">
                <MessageSquare size={18} />
              </div>
              <textarea
                required
                autoFocus
                className="w-full p-5 pl-14 bg-bg-primary border border-border-subtle rounded-2xl min-h-[140px] outline-none focus:ring-2 focus:ring-red-600 font-bold text-text-primary placeholder:text-text-secondary/20 transition-all resize-none"
                placeholder="EX: ITEM WAS DAMAGED UPON ARRIVAL..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-bg-primary text-text-secondary border border-border-subtle rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !reason.trim()}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Send Dispute'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
