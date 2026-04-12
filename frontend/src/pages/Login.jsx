import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setResendStatus('');
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Forces a refresh so Navbar catches the new token
      window.location.href = '/profile'; 
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid email or password";
      setError(errMsg);
      if (errMsg.includes("not verified")) {
          setIsUnverified(true);
      }
    }
  };

  const handleResend = async () => {
      try {
          const res = await api.post('/auth/resend-verification', { email: formData.email });
          setResendStatus(res.data.message);
          setError(''); // Clear the main error so the status shows nicely
      } catch (err) {
          setError(err.response?.data?.error || "Failed to resend email.");
      }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-bg-secondary p-8 rounded-[2rem] shadow-2xl border border-border-subtle transition-colors">
      <h2 className="text-3xl font-black mb-6 text-text-primary">Welcome Back</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-600/10 border-l-4 border-red-500 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-r-2xl transition-all animate-shake flex flex-col gap-3">
          <span>{error}</span>
          {isUnverified && (
             <button 
                onClick={handleResend}
                disabled={!formData.email}
                className="self-start px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
             >
                 Resend Activation Email
             </button>
          )}
        </div>
      )}

      {resendStatus && (
        <div className="mb-6 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-600 text-[11px] font-black uppercase tracking-widest rounded-r-2xl transition-all">
          {resendStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-text-secondary mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full p-4 bg-bg-primary border border-border-subtle text-text-primary rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition placeholder:text-text-secondary"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="name@email.com"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2 pb-1">
            <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Password</label>
            <Link to="/forgot-password" className="text-[10px] font-black uppercase text-blue-600 hover:text-text-primary transition-colors tracking-widest">Forgot Password?</Link>
          </div>
          <input 
            type="password" 
            className="w-full p-4 bg-bg-primary border border-border-subtle text-text-primary rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition placeholder:text-text-secondary"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
            required
          />
        </div>
        <button className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition shadow-lg shadow-blue-500/10">
          Sign In
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-text-secondary font-medium">
        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
      </p>
    </div>
  );
}