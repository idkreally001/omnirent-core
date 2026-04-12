import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <Mail size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 font-medium mb-8">Enter your email and we'll send you a recovery link.</p>

        {error && <p className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</p>}
        {message && <p className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100">{message}</p>}

        {!message && (
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest pl-2 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold border border-gray-100" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Recovery Link'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
