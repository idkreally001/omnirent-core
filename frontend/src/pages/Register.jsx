import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, UserPlus, MailCheck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check your details.");
    }
  };

  // Show success screen after registration
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-bg-secondary p-10 rounded-[2.5rem] shadow-2xl border border-border-subtle text-center transition-colors animate-in fade-in zoom-in duration-500">
        <div className="bg-green-600/10 text-green-600 border border-green-600/20 p-6 rounded-3xl inline-block mb-8 shadow-inner">
          <MailCheck size={56} />
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-3">Check Your Email</h2>
        <p className="text-text-secondary mb-6">
          We sent a verification link to <span className="font-bold text-text-primary">{formData.email}</span>. 
          Click the link to activate your account.
        </p>
        <Link to="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-bg-secondary p-8 rounded-3xl shadow-2xl border border-border-subtle transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-xl"><UserPlus size={24} /></div>
        <h2 className="text-3xl font-black text-text-primary">Join OmniRent</h2>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-600/10 border-l-4 border-red-500 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-r-2xl transition-all animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" placeholder="Full Name" className="w-full p-4 bg-bg-primary border border-border-subtle text-text-primary rounded-2xl outline-none placeholder:text-text-secondary" onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
        <input type="email" placeholder="Email Address" className="w-full p-4 bg-bg-primary border border-border-subtle text-text-primary rounded-2xl outline-none placeholder:text-text-secondary" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-4 bg-bg-primary border border-border-subtle text-text-primary rounded-2xl outline-none placeholder:text-text-secondary" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        <div className="p-4 bg-bg-primary border border-border-subtle rounded-2xl">
          <p className="text-[10px] text-text-secondary font-medium leading-relaxed uppercase tracking-wider">
            By creating an account, you agree to OmniRent's <Link to="/legal" className="text-blue-600 font-bold hover:underline">Legal & Policies</Link>.
          </p>
        </div>

        <button className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition shadow-lg shadow-blue-500/10">
          Create Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}