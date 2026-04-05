import { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ onClose, onSuccess, isLoading, setIsLoading }) {
  const [amount, setAmount] = useState(500);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCardFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : '');
  };

  const handleExpiryFormat = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
       val = val.substring(0,2) + '/' + val.substring(2,4);
    }
    setExpiry(val);
  }

  const handlePay = (e) => {
    e.preventDefault();
    if (!amount || amount < 50) return setError("Minimum deposit is 50₺");
    if (cardNumber.length < 19) return setError("Please enter a valid 16-digit card number.");
    if (expiry.length < 5) return setError("Please enter a valid expiry date (MM/YY).");
    
    // Expiration date logic check
    const [expMonth, expYear] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (parseInt(expMonth, 10) < 1 || parseInt(expMonth, 10) > 12) return setError("Invalid expiration month.");
    if (parseInt(expYear, 10) < currentYear || (parseInt(expYear, 10) === currentYear && parseInt(expMonth, 10) < currentMonth)) {
        return setError("Card has expired.");
    }

    if (cvc.length < 3) return setError("Please enter a valid CVC.");
    if (!name.trim()) return setError("Please enter the name on card.");
    if (!/^[a-zA-Z\s]+$/.test(name)) return setError("Name should only include Latin letters.");

    setError('');
    setIsLoading(true);

    // Simulate 1.5s bank processing time
    setTimeout(() => {
        onSuccess(amount);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
        <button 
          onClick={() => { if(!isLoading) onClose(); }} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition"
        >
          <X size={20}/>
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <CreditCard strokeWidth={2.5} size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Add Wallet Funds</h3>
            <p className="text-sm font-medium text-gray-500">Secure AES-256 encrypted checkout.</p>
          </div>
        </div>

        {error && (
            <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-3 rounded-xl flex items-center gap-2">
                <Lock size={14} /> {error}
            </p>
        )}

        <form onSubmit={handlePay} className="space-y-4">
          <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Deposit Amount (₺)</label>
              <input 
                type="number" 
                min="50"
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
                className="w-full text-2xl font-black text-gray-900 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
              />
          </div>

          <div className="pt-2 border-t border-gray-100">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Card Number</label>
             <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber}
                onChange={handleCardFormat}
                maxLength="19"
                className="w-full font-medium text-gray-900 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 mb-4 tracking-widest" 
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={handleExpiryFormat}
                        maxLength="5"
                        className="w-full font-medium text-gray-900 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0,4))}
                        className="w-full font-medium text-gray-900 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                  </div>
              </div>

              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Name on Card</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-medium text-gray-900 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
              />
          </div>

          <button 
            type="submit"
            disabled={isLoading} 
            className={`w-full py-4 rounded-2xl font-black transition text-sm text-white flex items-center justify-center gap-2 mt-4 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed animate-pulse' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
          >
            {isLoading ? (
                <>Processing Payment...</>
            ) : (
                <><ShieldCheck size={18} /> Pay {amount}₺</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
