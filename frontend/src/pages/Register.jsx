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
      <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 text-center">
        <div className="bg-green-100 text-green-600 p-4 rounded-2xl inline-block mb-6">
          <MailCheck size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Check Your Email</h2>
        <p className="text-gray-500 mb-6">
          We sent a verification link to <span className="font-bold text-gray-700">{formData.email}</span>. 
          Click the link to activate your account.
        </p>
        <Link to="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-xl"><UserPlus size={24} /></div>
        <h2 className="text-3xl font-black text-gray-900">Join OmniRent</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
        <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            By creating an account, you agree to OmniRent's <Link to="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</Link>, <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>, and <Link to="/usage" className="text-blue-600 font-bold hover:underline">Usage Agreement</Link>. You also consent to our Identity Uniqueness Verification process.
          </p>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          Create Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 font-medium">
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