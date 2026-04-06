import { ShoppingBag, Clock, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function BorrowedItems({ myRentals, onReturn, onConfirmHandover, onDispute }) {
  const activeRentals = myRentals.filter(r => r.status === 'active' || r.status === 'returned_by_renter' || r.status === 'pending_handover');
  const historyRentals = myRentals.filter(r => r.status === 'completed');

  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 transition-colors">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Borrowed Gear</h3>
        <span className="text-[10px] font-black text-green-600 bg-green-600/10 border border-green-600/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">{activeRentals.length} active</span>
      </div>

      {myRentals.length === 0 ? (
        <div className="text-center py-12 bg-bg-primary rounded-[2rem] border-2 border-dashed border-border-subtle">
          <ShoppingBag className="mx-auto text-text-secondary opacity-30 mb-4" size={48} />
          <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">You haven't borrowed anything yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          <div className="space-y-8">
            {activeRentals.length > 0 && (
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4">Currently Borrowing</h4>
                 {activeRentals.map(rental => (
                   <RentalCard 
                     key={rental.id} 
                     rental={rental} 
                     onReturn={() => onReturn(rental.id)} 
                     onConfirmHandover={() => onConfirmHandover(rental.id)}
                     onDispute={() => onDispute(rental.id)} 
                     isActive={rental.status === 'active'} 
                   />
                 ))}
              </div>
            )}
            {historyRentals.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 border-t border-border-subtle pt-8">Rental History</h4>
                {historyRentals.map(rental => (
                   <RentalCard key={rental.id} rental={rental} isActive={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RentalCard({ rental, onReturn, onConfirmHandover, onDispute, isActive }) {
  const isPendingReturn = rental.status === 'returned_by_renter';
  const isPendingHandover = rental.status === 'pending_handover';
  const isOverdue = isActive && new Date(rental.return_date) < new Date();
  
  return (
    <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 
      ${isPendingReturn ? 'bg-orange-600/5 border-orange-600/20' : 
        isPendingHandover ? 'bg-blue-600/5 border-blue-600/20' : 
        isActive ? 'bg-bg-primary border-border-subtle hover:border-blue-600/50' : 
        'bg-bg-primary/30 border-dashed border-border-subtle opacity-60'}`}>
      
      <div className="flex items-center gap-4 overflow-hidden">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-border-subtle ${isActive || isPendingHandover ? 'bg-bg-secondary text-blue-600' : 'bg-bg-primary text-text-secondary'}`}>
          {rental.image_url ? <img src={rental.image_url} alt="" className="object-cover w-full h-full" /> : <ShoppingBag size={24} />}
        </div>
        <div>
          <p className="font-black text-text-primary text-sm line-clamp-1 uppercase tracking-tight">{rental.title}</p>
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-500 animate-pulse' : 'text-text-secondary'}`}>
            {isPendingReturn ? <AlertCircle size={10} className="text-orange-500" /> : 
             isPendingHandover ? <Clock size={10} className="text-blue-500" /> :
             isOverdue ? <AlertCircle size={10} /> : 
             isActive ? <Clock size={10} /> : 
             <CheckCircle2 size={10} />}

            {isPendingReturn ? <span className="text-orange-600">Waiting for Owner Return Confirmation</span> : 
             isPendingHandover ? <span className="text-blue-600">Handover Required</span> :
             isOverdue ? <span>OVERDUE! Return ASAP</span> : 
             isActive ? `Due: ${new Date(rental.return_date).toLocaleDateString()}` : 
             `Completed`}
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-3 ml-4 flex-shrink-0">
        <div>
          <p className="text-sm font-black text-text-primary mb-1">{rental.total_price}₺</p>
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border
            ${isOverdue ? 'text-white bg-red-600 border-red-500 animate-bounce' : 
              isPendingReturn ? 'text-orange-600 bg-orange-600/10 border-orange-600/20' : 
              isPendingHandover ? 'text-blue-600 bg-blue-600/10 border-blue-600/20' :
              isActive ? 'text-green-600 bg-green-600/10 border-green-600/20' : 
              'text-text-secondary bg-bg-secondary border-border-subtle'}`}>
            {isOverdue ? 'OVERDUE' : isPendingReturn ? 'Pending Return' : isPendingHandover ? 'To Collect' : isActive ? 'Active' : 'History'}
          </span>
        </div>

        <div className="flex gap-2">
          {isPendingHandover && (
            <button onClick={onConfirmHandover} className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Confirm Receipt
            </button>
          )}
          
          {isActive && !isPendingReturn && (
            <>
              <button onClick={onDispute} title="Open Dispute" className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-600/20 bg-red-600/10 flex items-center justify-center active:scale-90">
                <AlertTriangle size={16} />
              </button>
              <button onClick={onReturn} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-white bg-blue-600/10 hover:bg-blue-600 px-4 py-2 rounded-xl transition-all border border-blue-600/20 active:scale-95">
                Return Item
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}