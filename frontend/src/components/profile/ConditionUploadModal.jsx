import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { compressImage, uploadToCloudinary } from '../../utils/imageCompression';
import api from '../../api/axios';

export default function ConditionUploadModal({ rentalId, stage, onClose, onSuccess }) {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // We only need 3 max
    if (images.length + files.length > 3) {
      return setError('You can only upload up to 3 evidence photos.');
    }

    try {
      setError('');
      setIsUploading(true);
      
      const newImages = [];
      for (const file of files) {
        // Compress natively in browser!
        const compressedFile = await compressImage(file);
        // Upload to free Cloudinary DB
        const secureUrl = await uploadToCloudinary(compressedFile);
        newImages.push(secureUrl);
      }

      setImages(prev => [...prev, ...newImages]);
    } catch (err) {
      setError('Failed to compress/upload image. Check connection.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (images.length < 1) {
      return setError('Please upload at least 1 photo of the item condition.');
    }
    try {
      setIsUploading(true);
      await api.post(`/rentals/${rentalId}/evidence`, { images, stage });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit evidence.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition"><X size={20}/></button>
        
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck size={32} />
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-2">Condition Log</h3>
        <p className="text-gray-500 text-sm mb-6 font-medium">
          Upload photos of the item's current state. This provides strict evidence and ensures fair dispute resolutions.
        </p>

        {error && <p className="text-red-600 text-xs font-bold mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}

        {/* Thumbnail Preview Area */}
        <div className="flex gap-4 justify-center mb-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
              {images[index] ? (
                <img src={images[index]} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <UploadCloud size={20} className="text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Upload Action */}
        {images.length < 3 && (
          <div className="relative mb-6">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`w-full py-4 rounded-2xl font-black transition text-sm flex items-center justify-center gap-2 border-2 border-dashed 
              ${isUploading ? 'bg-gray-100 border-gray-300 text-gray-400 animate-pulse' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
              <UploadCloud size={18} /> {isUploading ? 'Compressing & Uploading...' : 'Add Photos'}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 mb-4">
          <ShieldCheck size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[9px] text-gray-500 font-medium leading-tight">
            By uploading evidence, you agree to our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. These photos will be permanently bound to the rental escrow record and are only accessible by OmniRent Administrators.
          </p>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={images.length === 0 || isUploading} 
          className={`w-full py-4 rounded-2xl font-black transition text-sm text-white flex items-center justify-center gap-2 shadow-lg
            ${images.length === 0 || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 shadow-gray-300 hover:scale-[1.02]'}`}
        >
          {isUploading ? 'Securing Evidence...' : <><CheckCircle2 size={18} /> Verify Condition</>}
        </button>
      </div>
    </div>
  );
}
