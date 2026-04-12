import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';
import { compressImage, uploadToCloudinary } from '../../utils/imageCompression';
import api from '../../api/axios';

export default function ConditionUploadModal({ rentalId, stage, onClose, onSuccess }) {
  const [localPreviews, setLocalPreviews] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 3 - localPreviews.length;
    if (remainingSlots <= 0) {
      return setError('You can only upload up to 3 evidence photos.');
    }

    const filesToKeep = files.slice(0, remainingSlots);
    setError('');

    // Immediately create local preview URLs (no network upload yet)
    const newPreviews = filesToKeep.map(file => URL.createObjectURL(file));
    setLocalPreviews(prev => [...prev, ...newPreviews]);
    setPendingFiles(prev => [...prev, ...filesToKeep]);
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(localPreviews[indexToRemove]); // Free memory
    setLocalPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPendingFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleConfirm = async () => {
    if (pendingFiles.length < 1) {
      return setError('Please upload at least 1 photo.');
    }
    
    try {
      setIsUploading(true);
      setError('');

      // Parallel compress and upload ONLY when confirmed
      const uploadPromises = pendingFiles.map(async (file) => {
        const compressedFile = await compressImage(file);
        return uploadToCloudinary(compressedFile);
      });
      const uploadedUrls = await Promise.all(uploadPromises);

      // Submit to backend
      await api.post(`/rentals/${rentalId}/evidence`, { images: uploadedUrls, stage });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit evidence.');
      setIsUploading(false);
    }
  };

  // Prevent memory leaks when unmounting
  const handleClose = () => {
    localPreviews.forEach(url => URL.revokeObjectURL(url));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 transition-all duration-300">
      <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-8 max-w-md w-full shadow-2xl relative text-center transition-all duration-300">
        <button onClick={handleClose} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors"><X size={24}/></button>
        
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
            <div key={index} className="w-20 h-20 rounded-[1.25rem] bg-bg-primary border-2 border-dashed border-border-subtle flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-blue-600/30 relative group">
              {localPreviews[index] ? (
                <>
                  <img src={localPreviews[index]} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                  {!isUploading && (
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X size={12} />
                    </button>
                  )}
                </>
              ) : (
                <UploadCloud size={20} className="text-text-secondary opacity-20" />
              )}
            </div>
          ))}
        </div>

        {/* Upload Action */}
        {localPreviews.length < 3 && (
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
              ${isUploading ? 'bg-bg-primary border-border-subtle text-text-secondary cursor-not-allowed' : 'bg-blue-600/5 border-blue-600/20 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300'}`}>
              <UploadCloud size={18} /> Add Photos
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 mb-6 text-left">
          <ShieldCheck size={14} className="text-text-secondary opacity-40 shrink-0 mt-0.5" />
          <p className="text-[9px] text-text-secondary font-black uppercase tracking-widest leading-loose opacity-70">
            Evidence is bound to the rental escrow record. Admins will review these photos in case of a dispute. <Link to="/legal" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={localPreviews.length === 0 || isUploading} 
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all text-[11px] flex items-center justify-center gap-2 shadow-xl active:scale-95
            ${localPreviews.length === 0 || isUploading ? 'bg-bg-primary text-text-secondary border border-border-subtle cursor-not-allowed shadow-none' : 'bg-text-primary text-bg-primary hover:opacity-90'}`}
        >
          {isUploading ? 'Securing Evidence...' : <><CheckCircle2 size={18} /> Confirm Condition</>}
        </button>
      </div>
    </div>
  );
}
