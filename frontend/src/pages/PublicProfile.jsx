import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { User, Star, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await api.get(`/user/public/${id}`);
        setData(res.data);
      } catch (err) { 
        console.error(err); 
        setError("User profile not found or does not exist.");
      }
    };
    fetchPublicData();
  }, [id]);

  if (error) return <div className="text-center mt-20 font-black text-red-500 text-sm uppercase tracking-widest">{error}</div>;
  if (!data) return <div className="text-center mt-20 animate-pulse font-black text-gray-400 text-sm uppercase tracking-widest">Loading Trust Profile...</div>;

  const { user, reviews } = data;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center shadow-sm">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{user.full_name}</h2>
            
            <div className="flex items-center justify-center gap-1.5 mt-2 text-amber-500">
              <Star size={18} fill="currentColor" />
              <span className="text-lg font-black text-gray-900">{Number(user.avg_rating).toFixed(1)}</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl text-left">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Member Since</p>
                  <p className="text-xs font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {user.tc_no && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl text-left text-blue-600">
                  <CheckCircle2 size={18} />
                  <p className="text-[9px] font-black uppercase">Verified Identity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Reviews Feed */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            Community Feedback <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-400">{user.review_count}</span>
          </h3>

          {reviews.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
               <MessageSquare className="mx-auto text-gray-200 mb-2" size={32} />
               <p className="text-gray-400 font-bold">No reviews yet.</p>
            </div>
          ) : (
            reviews.map((r, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-black text-xs text-gray-400">
                      {r.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{r.reviewer_name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{r.comment || "No comment left."}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}