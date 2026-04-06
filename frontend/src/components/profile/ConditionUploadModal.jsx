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
    
    if (images.length + files.length > 3) {
      return setError('You can only upload up to 3 evidence photos.');
    }

    try {
      setError('');
      setIsUploading(true);
      
      const newImages = [];
      for (const file of files) {
        const compressedFile = await compressImage(file);
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
      return setError('Please upload at least 1 photo.');
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-all duration-300">
      <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-8 max-w-md w-full shadow-2xl relative text-center transition-all duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"><X size={24}/></button>
        
        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck size={32} />
        </div>
        
        <h3 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Condition Log</h3>
        <p className="text-text-secondary font-black tracking-widest text-[10px] uppercase mb-8">
            Strict photographic evidence to ensure professional dispute protection.
        </p>

        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 bg-red-600/10 border border-red-600/20 p-4 rounded-xl animate-shake">{error}</p>}

        {/* Thumbnail Preview Area */}
        <div className="flex gap-4 justify-center mb-8">
          {[0, 1, 2].map((index) => (
            <div key={index} className="w-20 h-20 rounded-[1.25rem] bg-bg-primary border-2 border-dashed border-border-subtle flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-blue-600/30">
              {images[index] ? (
                <img src={images[index]} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <UploadCloud size={20} className="text-text-secondary opacity-20" />
              )}
            </div>
          ))}
        </div>

        {/* Upload Action */}
        {images.length < 3 && (
          <div className="relative mb-8 group">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border-2 border-dashed 
              ${isUploading ? 'bg-bg-primary border-border-subtle text-text-secondary animate-pulse' : 'bg-blue-600/5 border-blue-600/20 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'}`}>
              <UploadCloud size={18} /> {isUploading ? 'Securing Evidence...' : 'Add Photos'}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 mb-6 text-left">
          <ShieldCheck size={14} className="text-text-secondary opacity-40 shrink-0 mt-0.5" />
          <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest leading-loose opacity-70">
            Evidence is bound to the rental escrow record. Admins will review these photos in case of a dispute. <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={images.length === 0 || isUploading} 
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all text-[11px] text-white flex items-center justify-center gap-2 shadow-xl active:scale-95
            ${images.length === 0 || isUploading ? 'bg-bg-primary text-text-secondary border border-border-subtle cursor-not-allowed' : 'bg-text-primary text-bg-primary hover:opacity-90'}`}
        >
          {isUploading ? 'Archiving Evidence...' : <><CheckCircle2 size={18} /> Confirm Condition</>}
        </button>
      </div>
    </div>
  );
}
