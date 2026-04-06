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

    setTimeout(() => {
        onSuccess(amount);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-all duration-300">
      <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-8 max-w-md w-full shadow-2xl relative transition-all duration-300">
        <button 
          onClick={() => { if(!isLoading) onClose(); }} 
          className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={24}/>
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CreditCard strokeWidth={2.5} size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Add Wallet Funds</h3>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-0.5">Secure AES-256 encrypted gateway</p>
          </div>
        </div>

        {error && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 bg-red-600/10 border border-red-600/20 p-4 rounded-xl flex items-center gap-2 animate-shake">
                <Lock size={14} /> {error}
            </p>
        )}

        <form onSubmit={handlePay} className="space-y-5">
          <div>
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">Deposit Amount (₺)</label>
              <input 
                type="number" 
                min="50"
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
                className="w-full text-3xl font-black text-text-primary p-5 bg-bg-primary border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 tracking-tighter" 
              />
          </div>

          <div className="pt-4 border-t border-border-subtle/50">
             <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">Card Number</label>
             <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber}
                onChange={handleCardFormat}
                maxLength="19"
                className="w-full font-bold text-text-primary p-4 bg-bg-primary border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 mb-4 tracking-widest placeholder:text-text-secondary/20" 
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={handleExpiryFormat}
                        maxLength="5"
                        className="w-full font-bold text-text-primary p-4 bg-bg-primary border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-center" 
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0,4))}
                        className="w-full font-bold text-text-primary p-4 bg-bg-primary border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-center" 
                      />
                  </div>
              </div>

              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">Name on Card</label>
              <input 
                type="text" 
                placeholder="CARDHOLDER NAME" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-bold text-text-primary p-4 bg-bg-primary border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 uppercase tracking-widest placeholder:text-text-secondary/20" 
              />
          </div>

          <button 
            type="submit"
            disabled={isLoading} 
            className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all text-[11px] text-white flex items-center justify-center gap-2 mt-4 active:scale-95 shadow-xl
                ${isLoading ? 'bg-blue-400 cursor-not-allowed animate-pulse' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
          >
            {isLoading ? (
                <>Processing Payment...</>
            ) : (
                <><ShieldCheck size={18} /> Pay {amount}₺ Securely</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
