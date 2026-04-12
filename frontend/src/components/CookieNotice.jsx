import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10); // Auto-hide after 10 seconds

  useEffect(() => {
    // Check if the user has already acknowledged
    // Using a new storage key to reset it from previous mockups
    const consent = localStorage.getItem('omniCookieAck');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (countdown <= 0) {
      handleDismiss();
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, countdown]);

  const handleDismiss = () => {
    localStorage.setItem('omniCookieAck', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[380px] bg-bg-secondary border border-border-subtle p-5 rounded-[2rem] shadow-2xl z-[999] animate-in slide-in-from-bottom-5 duration-500"
      role="region"
      aria-label="Cookie Information"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 text-text-primary">
          <div className="p-2 bg-text-primary text-bg-primary rounded-xl">
            <Cookie size={18} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-widest">Cookie Notice</h3>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-text-secondary hover:text-text-primary transition-colors p-1"
          aria-label="Dismiss cookie notice"
        >
          <X size={18} />
        </button>
      </div>
      
      <p className="text-xs font-medium text-text-secondary mb-5 leading-relaxed">
        We use essential cookies to ensure the platform functions securely and to provide you with a seamless experience. 
      </p>

      <div className="flex items-center justify-between gap-4 mt-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest tabular-nums animate-pulse">
          Auto-hiding in {countdown}s
        </span>
        <button 
          onClick={handleDismiss}
          className="py-2.5 px-6 bg-text-primary text-bg-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-80 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
