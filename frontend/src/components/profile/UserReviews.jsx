import { Star, MessageSquare } from 'lucide-react';

export default function UserReviews({ reviews }) {
  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 transition-colors">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Community Feedback</h3>
        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">{reviews.length} reviews</span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-bg-primary rounded-[2rem] border-2 border-dashed border-border-subtle">
          <MessageSquare className="mx-auto text-text-secondary opacity-30 mb-4" size={48} />
          <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">No community feedback yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-6 bg-bg-primary rounded-[2rem] border border-border-subtle hover:border-amber-500/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="overflow-hidden pr-4">
                  <p className="font-black text-text-primary text-sm truncate uppercase tracking-tight">{rev.reviewer_name}</p>
                  <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex text-amber-500 flex-shrink-0">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed italic border-l-2 border-border-subtle pl-4 ml-1">"{rev.comment || "No comment left."}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}