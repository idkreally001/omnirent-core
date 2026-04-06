import { Package, Trash2, AlertCircle, User, Clock, AlertTriangle } from 'lucide-react';

export default function MyListings({ myItems, onItemDeleteClick, onConfirmReceipt, onDispute }) {
  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 transition-colors">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">My Equipment</h3>
        <span className="text-[10px] font-black text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">{myItems.length} items</span>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-12 bg-bg-primary rounded-[2rem] border-2 border-dashed border-border-subtle">
          <Package className="mx-auto text-text-secondary opacity-30 mb-4" size={48} />
          <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">No active listings found.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        <div className="grid grid-cols-1 gap-5">
          {myItems.map(item => (
            <div key={item.id} className={`flex flex-col p-5 rounded-[2rem] border transition-all duration-300 group ${item.rental_status === 'returned_by_renter' ? 'bg-orange-600/5 border-orange-600/40 shadow-xl shadow-orange-500/5' : 'bg-bg-primary border-border-subtle hover:border-blue-600/50'}`}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center transition-colors border border-border-subtle ${item.status === 'rented' ? 'bg-orange-600/10 text-orange-600' : 'bg-bg-secondary text-blue-600'}`}>
                    <Package size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-text-primary text-sm truncate uppercase tracking-tight">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-blue-600 font-bold">{item.price_per_day}₺/day</p>
                      {item.status === 'rented' && (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-orange-600/10 text-orange-600 px-2 py-0.5 rounded-lg border border-orange-600/20 flex items-center gap-1">
                          Active Rental
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {item.status === 'available' && (
                  <button 
                    onClick={() => onItemDeleteClick(item)} 
                    className="p-3 text-text-secondary hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {item.status === 'rented' && (
                 <div className="mt-5 pt-5 border-t border-border-subtle/50">
                    {item.rental_status === 'returned_by_renter' ? (
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-orange-600 font-black text-[9px] uppercase tracking-widest animate-pulse">
                              <AlertCircle size={14} /> Action Required
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => onDispute(item.active_rental_id)}
                              className="bg-red-600/10 text-red-600 p-2.5 rounded-xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center active:scale-95"
                              title="Report Issue"
                            >
                              <AlertTriangle size={16} />
                            </button>
                            <button 
                              onClick={() => onConfirmReceipt(item.active_rental_id)}
                              className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all active:scale-95"
                            >
                              Confirm Return
                            </button>
                          </div>
                      </div>
                     ) : item.rental_status === 'pending_handover' ? (
                        <div className="flex justify-between items-center bg-blue-600/5 p-4 rounded-2xl border border-blue-600/20 w-full">
                           <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-black text-[9px] uppercase tracking-widest">
                               <Clock size={16} className="animate-spin-slow" /> Awaiting Handover
                           </div>
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Give to {item.renter_name || 'User'}</p>
                        </div>
                     ) : (
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <div className="flex items-center gap-2 text-text-secondary">
                              <User size={12} />
                              <span>Renter: {item.renter_name || 'User'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600">
                              <Clock size={12} />
                              <span>Due: {new Date(item.return_date).toLocaleDateString()}</span>
                          </div>
                      </div>
                     )}
                 </div>
              )}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}