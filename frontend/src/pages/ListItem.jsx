import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PackagePlus, ArrowRight } from 'lucide-react';

export default function ListItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Tools',
    image_url: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', formData);
      navigate('/browse'); // Go see your new listing!
    } catch (err) {
      alert("Error creating listing. Make sure you are logged in.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
          <PackagePlus size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">List an Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">What are you renting?</label>
          <input 
            type="text" 
            placeholder="e.g., Bosch Professional Drill"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition font-semibold"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Category</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition font-semibold"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Tools</option>
              <option>Electronics</option>
              <option>Camping</option>
              <option>Photography</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Price / Day (₺)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition font-semibold"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Add this block inside your ListItem form */}
<div>
  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Image URL (Optional)</label>
  <input 
    type="url" 
    placeholder="https://images.unsplash.com/photo-..."
    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition font-semibold"
    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
  />
  <p className="text-xs text-gray-400 mt-2 ml-1 font-medium">Paste a link to an image of your item.</p>
</div>

        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Description</label>
          <textarea 
            rows="4"
            placeholder="Tell us about the condition and features..."
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition font-semibold"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 group">
          Publish Listing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}