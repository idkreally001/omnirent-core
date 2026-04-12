import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500 mb-6">No reset token found in the URL.</p>
        <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">Request a new link</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Create New Password</h1>
        <p className="text-gray-500 font-medium mb-8">Your new password must be at least 6 characters long.</p>

        {error && <p className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</p>}
        {success && (
          <div className="mb-4 p-6 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100 flex flex-col items-center gap-3">
             <CheckCircle2 size={32} />
             <p className="text-center">{success}</p>
             <p className="text-[10px] text-green-600 uppercase tracking-widest mt-2">Redirecting to login...</p>
          </div>
        )}

        {!success && (
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest pl-2 mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold border border-gray-100" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Secure Account'} <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
