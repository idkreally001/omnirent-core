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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[1.25rem] flex items-center justify-center mb-6 mx-auto">
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 mb-2">Raise a Dispute</h3>
          <p className="text-gray-500 text-sm mb-8 font-medium">
            Please describe the issue in detail. An administrator will review your claim and the uploaded evidence photos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute top-4 left-4 text-gray-400">
                <MessageSquare size={18} />
              </div>
              <textarea
                required
                autoFocus
                className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl min-h-[120px] outline-none focus:ring-2 focus:ring-red-500 font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="Ex: Item was damaged upon arrival / Item was not as described..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !reason.trim()}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
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
