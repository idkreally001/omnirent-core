import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { PackagePlus, ArrowRight, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { compressImage, uploadToCloudinary } from '../utils/imageCompression';

export default function ListItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Tools',
    image_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError('');
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const secureUrl = await uploadToCloudinary(compressedFile);
      setFormData({...formData, image_url: secureUrl});
    } catch (err) {
      setError('Failed to compress/upload image. Please check your connection.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

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

        {/* CLOUDINARY UPLOAD HOOK */}
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-1">Item Photo (Optional)</label>
          
          {error && <p className="text-red-500 text-xs font-bold mb-2 ml-1 bg-red-50 p-2 rounded-lg">{error}</p>}

          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            {formData.image_url ? (
              <div className="w-full h-48 rounded-2xl overflow-hidden border-2 border-green-200 relative group bg-gray-50 flex items-center justify-center">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold flex items-center gap-2"><UploadCloud /> Click to change</span>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                   <CheckCircle2 size={16} />
                </div>
              </div>
            ) : (
              <div className={`w-full py-12 rounded-2xl transition border-2 border-dashed flex flex-col items-center justify-center gap-3
                ${isUploading ? 'bg-gray-100 border-gray-300 text-gray-400 animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                <UploadCloud size={32} className={isUploading ? 'text-gray-300' : 'text-blue-500'} /> 
                <span className="font-bold text-sm">
                  {isUploading ? 'Compressing & Uploading...' : 'Click or Drag to Upload Photo'}
                </span>
                {!isUploading && <span className="text-xs font-medium text-gray-400">Powered by Cloudinary Storage Engine</span>}
              </div>
            )}
          </div>
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

        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3 mt-6">
          <ShieldCheck size={20} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            By publishing this listing, you confirm that you legally own this asset and agree to OmniRent's <Link to="/usage" className="text-blue-600 font-bold hover:underline">Usage Agreement</Link>. You also agree to adhere to the photographic evidence guidelines mandated by the Trust & Safety Engine during handovers.
          </p>
        </div>

        <button 
          disabled={isUploading}
          className={`w-full py-4 mt-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group transition
            ${isUploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-xl shadow-gray-200'}`}>
          {isUploading ? 'Wait for upload...' : <>Publish Listing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </form>
    </div>
  );
}