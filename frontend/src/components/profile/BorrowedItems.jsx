import { ShoppingBag, Clock, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function BorrowedItems({ myRentals, onReturn, onConfirmHandover, onDispute }) {
  const isOverdue = (returnDate, status) => {
    return status === 'active' && new Date(returnDate) < new Date();
  };

  const activeRentals = myRentals.filter(r => r.status === 'active' || r.status === 'returned_by_renter' || r.status === 'pending_handover');
  const historyRentals = myRentals.filter(r => r.status === 'completed');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900">Borrowed Items</h3>
        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">{activeRentals.length} active</span>
      </div>

      {myRentals.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <ShoppingBag className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-gray-400 font-bold text-sm">You haven't rented anything yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        <div className="space-y-8">
          {activeRentals.length > 0 && (
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Currently Borrowing</h4>
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
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 border-t border-gray-100 pt-6">Rental History</h4>
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
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all 
      ${isPendingReturn ? 'bg-orange-50 border-orange-200' : 
        isPendingHandover ? 'bg-blue-50 border-blue-200' : 
        isActive ? 'bg-gray-50 border-gray-100 hover:border-blue-100' : 
        'bg-gray-50/50 border-gray-100 opacity-60'}`}>
      
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm overflow-hidden ${isActive || isPendingHandover ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {rental.image_url ? <img src={rental.image_url} alt="" className="object-cover w-full h-full" /> : <ShoppingBag size={20} />}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm line-clamp-1">{rental.title}</p>
          <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
            {isPendingReturn ? <AlertCircle size={12} className="text-orange-500" /> : 
             isPendingHandover ? <Clock size={12} className="text-blue-500" /> :
             isOverdue ? <AlertCircle size={12} className="animate-pulse" /> : 
             isActive ? <Clock size={12} /> : 
             <CheckCircle2 size={12} />}

            {isPendingReturn ? <span className="text-orange-600">Waiting for Owner Return Confirmation</span> : 
             isPendingHandover ? <span className="text-blue-600">Pending Handover (Meet Owner)</span> :
             isOverdue ? <span>OVERDUE! Return ASAP</span> : 
             isActive ? `Due: ${new Date(rental.return_date).toLocaleDateString()}` : 
             `Completed`}
          </div>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <div>
          <p className="text-xs font-black text-gray-900">{rental.total_price}₺</p>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded 
            ${isOverdue ? 'text-white bg-red-500 animate-pulse' : 
              isPendingReturn ? 'text-orange-600 bg-orange-100' : 
              isPendingHandover ? 'text-blue-600 bg-blue-100' :
              isActive ? 'text-green-600 bg-green-100' : 
              'text-gray-500 bg-gray-200'}`}>
            {isOverdue ? 'OVERDUE' : isPendingReturn ? 'Pending Return' : isPendingHandover ? 'To Be Picked Up' : isActive ? 'Active' : 'Completed'}
          </span>
        </div>

        <div className="flex gap-2">
          {isPendingHandover && (
            <button onClick={onConfirmHandover} className="text-[10px] font-black uppercase text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all shadow-md">
              Confirm Receipt
            </button>
          )}
          
          {isActive && !isPendingReturn && (
            <>
              <button onClick={onDispute} className="text-[10px] font-black uppercase text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all border border-red-100 shadow-sm flex items-center justify-center">
                <AlertTriangle size={14} />
              </button>
              <button onClick={onReturn} className="text-[10px] font-black uppercase text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-all shadow-sm border border-blue-100">
                Return Item
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}