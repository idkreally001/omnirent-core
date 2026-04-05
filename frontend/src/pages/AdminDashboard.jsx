import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  // Protect Admin Route visually
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.is_admin) {
    window.location.href = '/profile';
    return null;
  }

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/admin/disputes');
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const openDispute = async (dispute) => {
    setSelectedDispute(dispute);
    setEvidence([]);
    try {
      const res = await api.get(`/admin/disputes/${dispute.id}/evidence`);
      setEvidence(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (outcome) => {
    try {
      setResolving(true);
      await api.put(`/admin/disputes/${selectedDispute.id}/resolve`, {
        resolution: outcome,
        admin_notes: resolutionNote
      });
      setSelectedDispute(null);
      setResolutionNote('');
      fetchDisputes();
    } catch (err) {
      console.error(err);
      alert('Failed to resolve dispute.');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trust & Safety Engine</h1>
          <p className="text-gray-500 font-medium">Administrator Dispute Resolution Center</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tickets */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Active Tickets</h2>
          {loading ? (
             <div className="animate-pulse flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
             </div>
          ) : disputes.length === 0 ? (
             <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
                <ShieldCheck size={48} className="mx-auto text-green-100 mb-4" />
                <p className="text-gray-500 font-bold">No disputes found. System is healthy.</p>
             </div>
          ) : (
            disputes.map(d => (
              <div 
                key={d.id} 
                onClick={() => openDispute(d)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedDispute?.id === d.id ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white border-gray-100 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${d.status === 'open' ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'}`}>
                      {d.status}
                   </div>
                   <span className={`text-[10px] font-bold ${selectedDispute?.id === d.id ? 'text-gray-400' : 'text-gray-400'}`}>#{d.id}</span>
                </div>
                <h3 className="font-bold text-sm line-clamp-1 mb-1">{d.reason}</h3>
                <p className={`text-xs ${selectedDispute?.id === d.id ? 'text-gray-300' : 'text-gray-500'}`}>By: {d.raiser_name}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Dispute Detail & Evidence Room */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h2 className="text-2xl font-black text-gray-900">{selectedDispute.item_title}</h2>
                      <p className="text-gray-500 font-medium mt-1">Dispute claimed by <span className="font-bold text-gray-900">{selectedDispute.raiser_name}</span></p>
                   </div>
                   <button onClick={() => setSelectedDispute(null)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition"><X size={20}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                   <div>
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Owner</p>
                       <p className="font-bold text-gray-900">{selectedDispute.owner_name}</p>
                   </div>
                   <div>
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Renter</p>
                       <p className="font-bold text-gray-900">{selectedDispute.renter_name}</p>
                   </div>
                </div>

                {/* Evidence Room */}
                <h3 className="text-sm font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Photographic Evidence Log</h3>
                
                {evidence.length === 0 ? (
                    <div className="bg-orange-50 p-6 rounded-2xl flex items-center gap-4 text-orange-600 mb-8 font-bold">
                        <AlertCircle /> No evidence was submitted for this transaction.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 mb-8">
                        {/* Handover Evidence */}
                        <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100">
                           <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 inline-block rounded-md">Pre-Flight (Handover)</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Renter Pick-up Condition</p>
                           <div className="flex flex-wrap gap-2">
                              {evidence.filter(e => e.stage === 'handover').map(e => (
                                 <img key={e.id} src={e.image_url} alt="Handover" className="w-24 h-24 object-cover rounded-xl bg-gray-100 border border-gray-200" />
                              ))}
                           </div>
                        </div>

                        {/* Return Evidence */}
                        <div className="space-y-4 bg-white p-4 rounded-2xl border border-blue-100">
                           <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 inline-block rounded-md">Post-Flight (Return)</h4>
                           
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {/* Renter Return Phase */}
                               <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Renter Drop-off</p>
                                  <div className="flex flex-wrap gap-2">
                                     {evidence.filter(e => e.stage === 'return' && e.uploaded_by === selectedDispute.renter_id).map(e => (
                                        <img key={e.id} src={e.image_url} alt="Renter Return" className="w-20 h-20 object-cover rounded-xl bg-white border border-gray-200" />
                                     ))}
                                  </div>
                               </div>

                               {/* Owner Confirm Phase */}
                               <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Owner Received</p>
                                  <div className="flex flex-wrap gap-2">
                                     {evidence.filter(e => e.stage === 'return' && e.uploaded_by === selectedDispute.owner_id).map(e => (
                                        <img key={e.id} src={e.image_url} alt="Owner Receive" className="w-20 h-20 object-cover rounded-xl bg-white border border-gray-200" />
                                     ))}
                                  </div>
                               </div>
                           </div>
                        </div>
                    </div>
                )}

                {/* Dispute Statement */}
                <div className="bg-red-50 p-6 rounded-2xl mb-8">
                   <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertCircle size={16}/> Dispute Statement</h3>
                   <p className="text-red-900 font-medium italic">"{selectedDispute.reason}"</p>
                </div>

                {/* Resolution actions */}
                {selectedDispute.status === 'open' ? (
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-black text-gray-900">Resolve Dispute</h3>
                    <input 
                        type="text" 
                        placeholder="Admin notes (Internal logic justification)" 
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition font-medium text-sm"
                    />
                    <div className="flex gap-4">
                        <button 
                            disabled={resolving || !resolutionNote}
                            onClick={() => handleResolve('pay_owner')}
                            className="flex-1 py-4 bg-green-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-green-700 transition disabled:opacity-50"
                        >
                            Side with Owner
                        </button>
                        <button 
                            disabled={resolving || !resolutionNote}
                            onClick={() => handleResolve('refund_renter')}
                            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Refund Renter
                        </button>
                    </div>
                 </div>
                ) : (
                    <div className="bg-gray-100 p-6 rounded-2xl">
                       <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Resolution: {selectedDispute.resolution}</h3>
                       <p className="text-gray-900 font-bold">{selectedDispute.admin_notes}</p>
                    </div>
                )}
                
             </div>
          ) : (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-gray-400">
                <ShieldCheck size={48} className="mb-4 opacity-50" />
                <p className="font-bold">Select a dispute ticket to review evidence</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
