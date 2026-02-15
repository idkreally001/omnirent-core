import { useState } from 'react';
import { Star, X, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function ReviewModal({ rentalId, itemTitle, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await api.post('/reviews', { rentalId, rating, comment });
      onSuccess("Review submitted! Trust score updated.");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-4 mx-auto">
            <Star size={32} fill={rating > 0 ? "currentColor" : "none"} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 leading-tight">Rate your experience</h3>
          <p className="text-gray-400 text-sm font-medium mt-2">How was the transaction for <span className="text-blue-600 font-bold">"{itemTitle}"</span>?</p>
        </div>

        {/* STAR RATING PICKER */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star 
                size={36} 
                className={`${(hover || rating) >= star ? 'text-amber-400' : 'text-gray-200'} transition-colors`}
                fill={(hover || rating) >= star ? "currentColor" : "none"}
                strokeWidth={2.5}
              />
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <MessageSquare className="absolute top-4 left-4 text-gray-300" size={18} />
          <textarea 
            placeholder="Tell us more (optional)..."
            className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm h-24 resize-none"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-gray-200 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Posting...' : 'Submit Review'}
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={12} /> Verified Feedback
        </div>
      </div>
    </div>
  );
}