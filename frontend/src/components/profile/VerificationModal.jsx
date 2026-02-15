import { X, ShieldAlert } from 'lucide-react';

export default function VerificationModal({ onClose, onVerify, isLoading, tcInput, setTcInput }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
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
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-sm">Cancel</button>
          <button 
            onClick={onVerify} 
            disabled={isLoading || tcInput.length !== 11}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>
      </div>
    </div>
  );
}