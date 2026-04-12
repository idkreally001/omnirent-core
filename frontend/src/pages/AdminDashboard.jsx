import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, X, AlertCircle, Users, Ban } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('disputes'); // 'disputes' | 'users'
  const [disputes, setDisputes] = useState([]);
  const [users, setUsers] = useState([]);
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
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDisputes();
    fetchUsers();
    setLoading(false);
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

  const handleToggleBan = async (userId, currentStatus, isAdmin) => {
    if (isAdmin) return alert("Cannot ban an admin.");
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/ban`, { is_banned: !currentStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle ban status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 font-sans pb-12">
      <div className="flex items-center gap-4 mt-8 mb-8">
        <div className="w-16 h-16 bg-text-primary text-bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Trust & Safety Engine</h1>
          <p className="text-text-secondary font-medium">Administrator Operations Center</p>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-border-subtle pb-0">
        <button 
          onClick={() => setActiveTab('disputes')} 
          className={`font-black uppercase tracking-widest text-sm pb-4 border-b-2 transition-all ${activeTab === 'disputes' ? 'border-text-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'}`}
        >
          Dispute Resolution
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`font-black uppercase tracking-widest text-sm pb-4 border-b-2 transition-all ${activeTab === 'users' ? 'border-text-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'}`}
        >
          User Moderation
        </button>
      </div>

      {activeTab === 'disputes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Tickets */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-black text-text-secondary uppercase tracking-widest pl-2">Active Tickets</h2>
            {loading ? (
               <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-bg-secondary border border-border-subtle rounded-2xl"></div>)}
               </div>
            ) : disputes.length === 0 ? (
               <div className="bg-bg-secondary p-8 rounded-3xl border border-border-subtle text-center">
                  <ShieldCheck size={48} className="mx-auto text-green-500/20 mb-4" />
                  <p className="text-text-secondary font-bold">No disputes found. System is healthy.</p>
               </div>
            ) : (
              disputes.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => openDispute(d)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedDispute?.id === d.id ? 'bg-text-primary text-bg-primary border-text-primary shadow-xl' : 'bg-bg-secondary border-border-subtle hover:border-text-secondary'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${d.status === 'open' ? 'bg-orange-500/10 text-orange-500' : 'bg-bg-primary text-text-secondary'}`}>
                        {d.status}
                     </div>
                     <span className={`text-[10px] font-bold ${selectedDispute?.id === d.id ? 'opacity-50' : 'text-text-secondary'}`}>#{d.id}</span>
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1 mb-1">{d.reason}</h3>
                  <p className={`text-xs ${selectedDispute?.id === d.id ? 'opacity-70' : 'text-text-secondary'}`}>By: {d.raiser_name}</p>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Dispute Detail & Evidence Room */}
          <div className="lg:col-span-2">
            {selectedDispute ? (
               <div className="bg-bg-secondary rounded-[2.5rem] p-8 border border-border-subtle shadow-xl shadow-blue-500/5">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-text-primary">{selectedDispute.item_title}</h2>
                        <p className="text-text-secondary font-medium mt-1">Dispute claimed by <span className="font-bold text-text-primary">{selectedDispute.raiser_name}</span></p>
                     </div>
                     <button onClick={() => setSelectedDispute(null)} className="p-2 bg-bg-primary text-text-secondary rounded-xl hover:bg-border-subtle transition"><X size={20}/></button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 bg-bg-primary border border-border-subtle p-4 rounded-2xl">
                     <div>
                         <p className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Owner</p>
                         <p className="font-bold text-text-primary">{selectedDispute.owner_name}</p>
                     </div>
                     <div>
                         <p className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Renter</p>
                         <p className="font-bold text-text-primary">{selectedDispute.renter_name}</p>
                     </div>
                  </div>

                  {/* Evidence Room */}
                  <h3 className="text-sm font-black text-text-primary mb-4 border-b border-border-subtle pb-2">Photographic Evidence Log</h3>
                  
                  {evidence.length === 0 ? (
                      <div className="bg-orange-500/10 p-6 rounded-2xl flex items-center gap-4 text-orange-500 mb-8 font-bold">
                          <AlertCircle /> No evidence was submitted for this transaction.
                      </div>
                  ) : (
                      <div className="flex flex-col gap-6 mb-8">
                          {/* Handover Evidence */}
                          <div className="space-y-3 bg-bg-secondary p-4 rounded-2xl border border-border-subtle">
                             <h4 className="text-xs font-black uppercase tracking-widest text-text-secondary bg-bg-primary px-3 py-1 inline-block rounded-md">Pre-Flight (Handover)</h4>
                             <p className="text-[10px] font-bold text-text-secondary uppercase mb-2">Renter Pick-up Condition</p>
                             <div className="flex flex-wrap gap-2">
                                {evidence.filter(e => e.stage === 'handover').map(e => (
                                   <img key={e.id} src={e.image_url} alt="Handover" className="w-24 h-24 object-cover rounded-xl bg-bg-primary border border-border-subtle" />
                                ))}
                             </div>
                          </div>

                          {/* Return Evidence */}
                          <div className="space-y-4 bg-bg-secondary p-4 rounded-2xl border border-blue-500/30">
                             <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 inline-block rounded-md">Post-Flight (Return)</h4>
                             
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {/* Renter Return Phase */}
                                 <div className="bg-bg-primary p-3 rounded-xl border border-border-subtle">
                                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-2">Renter Drop-off</p>
                                    <div className="flex flex-wrap gap-2">
                                       {evidence.filter(e => e.stage === 'return' && e.uploaded_by === selectedDispute.renter_id).map(e => (
                                          <img key={e.id} src={e.image_url} alt="Renter Return" className="w-20 h-20 object-cover rounded-xl bg-bg-secondary border border-border-subtle" />
                                       ))}
                                    </div>
                                 </div>

                                 {/* Owner Confirm Phase */}
                                 <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Owner Received</p>
                                    <div className="flex flex-wrap gap-2">
                                       {evidence.filter(e => e.stage === 'return' && e.uploaded_by === selectedDispute.owner_id).map(e => (
                                          <img key={e.id} src={e.image_url} alt="Owner Receive" className="w-20 h-20 object-cover rounded-xl bg-bg-secondary border border-border-subtle" />
                                       ))}
                                    </div>
                                 </div>
                             </div>
                          </div>
                      </div>
                  )}

                  {/* Dispute Statement */}
                  <div className="bg-red-500/10 p-6 rounded-2xl mb-8 border border-red-500/20">
                     <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertCircle size={16}/> Dispute Statement</h3>
                     <p className="text-red-500 font-medium italic">"{selectedDispute.reason}"</p>
                  </div>

                  {/* Resolution actions */}
                  {selectedDispute.status === 'open' ? (
                      <div className="space-y-4 pt-6 border-t border-border-subtle">
                      <h3 className="text-sm font-black text-text-primary">Resolve Dispute</h3>
                      <input 
                          type="text" 
                          placeholder="Admin notes (Internal logic justification)" 
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          className="w-full p-4 bg-bg-primary text-text-primary border border-border-subtle rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-sm placeholder:text-text-secondary"
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
                      <div className="bg-bg-primary p-6 rounded-2xl border border-border-subtle">
                         <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-2">Resolution: {selectedDispute.resolution}</h3>
                         <p className="text-text-primary font-bold">{selectedDispute.admin_notes}</p>
                      </div>
                  )}
                  
               </div>
            ) : (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-bg-secondary rounded-[2.5rem] border-2 border-dashed border-border-subtle text-text-secondary">
                  <ShieldCheck size={48} className="mb-4 opacity-50" />
                  <p className="font-bold">Select a dispute ticket to review evidence</p>
               </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle p-8 shadow-xl">
           <div className="flex items-center gap-3 mb-8">
             <Users size={24} className="text-text-primary" />
             <h2 className="text-2xl font-black text-text-primary">Platform Users</h2>
           </div>
           <div className="overflow-x-auto rounded-xl border border-border-subtle">
             <table className="w-full text-left border-collapse min-w-[700px]">
               <thead className="bg-bg-primary">
                 <tr className="border-b border-border-subtle text-[10px] uppercase tracking-widest text-text-secondary">
                   <th className="py-4 px-6 font-black">ID</th>
                   <th className="py-4 px-6 font-black">Name</th>
                   <th className="py-4 px-6 font-black">Email</th>
                   <th className="py-4 px-6 font-black">Status</th>
                   <th className="py-4 px-6 font-black text-right">Action</th>
                 </tr>
               </thead>
               <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-border-subtle hover:bg-bg-primary/50 transition-colors">
                      <td className="py-4 px-6 text-xs font-bold text-text-secondary">#{u.id}</td>
                      <td className="py-4 px-6 font-bold text-text-primary flex items-center gap-2">
                        {u.full_name} 
                        {u.is_admin && <ShieldCheck size={14} className="text-blue-500" title="Administrator" />}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary font-medium">{u.email}</td>
                      <td className="py-4 px-6">
                        {u.is_banned ? (
                           <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-md text-[10px] flex w-max items-center gap-1 font-black uppercase">
                              <Ban size={12} /> Banned
                           </span>
                        ) : (
                           <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-[10px] font-black uppercase inline-block">
                              Active
                           </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!u.is_admin ? (
                           <button 
                             onClick={() => handleToggleBan(u.id, u.is_banned, u.is_admin)}
                             className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition shadow-sm ${u.is_banned ? 'bg-text-primary text-bg-primary hover:opacity-80' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'}`}
                           >
                              {u.is_banned ? 'Unban User' : 'Ban User'}
                           </button>
                        ) : (
                           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-sm text-text-secondary font-bold">
                        No users loaded or system empty.
                      </td>
                    </tr>
                  )}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
}
