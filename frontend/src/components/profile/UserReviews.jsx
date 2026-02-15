import { Star, MessageSquare } from 'lucide-react';

export default function UserReviews({ reviews }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
        My Reviews <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-400">{reviews.length}</span>
      </h3>

      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-gray-400 font-bold text-sm">No reviews from the community yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-black text-gray-900">{rev.reviewer_name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-gray-600 text-xs italic leading-relaxed">"{rev.comment || "No comment left."}"</p>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}