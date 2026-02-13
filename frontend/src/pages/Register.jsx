import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', tcNo: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check your details.");
    }
  };

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
        <input type="text" placeholder="ID Number (TC No)" maxLength="11" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, tcNo: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

        <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start">
          <ShieldCheck className="text-blue-600 shrink-0" size={20} />
          <p className="text-xs text-blue-800 font-medium">Verified using secure NVI service.</p>
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition">
          Create Account
        </button>
      </form>
    </div>
  );
}