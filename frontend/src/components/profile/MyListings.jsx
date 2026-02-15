import { Package, Trash2, AlertCircle, User, Clock } from 'lucide-react';

export default function MyListings({ myItems, onItemDeleteClick, onConfirmReceipt }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900">My Listings</h3>
        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{myItems.length} items</span>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Package className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-gray-400 font-bold text-sm">No items listed.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          {myItems.map(item => (
            <div key={item.id} className={`flex flex-col p-4 rounded-2xl border transition-all group ${item.rental_status === 'returned_by_renter' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors ${item.status === 'rented' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-blue-600'}`}>
                    <Package size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-blue-600 font-black">{item.price_per_day}₺/day</p>
                      {item.status === 'rented' && (
                        <span className="text-[8px] font-black uppercase bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                          Rented
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {item.status === 'available' && (
                  <button 
                    onClick={() => onItemDeleteClick(item)} 
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {item.status === 'rented' && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    {item.rental_status === 'returned_by_renter' ? (
                      <div className="flex items-center justify-between animate-pulse">
                          <div className="flex items-center gap-2 text-orange-700 font-black text-[10px] uppercase">
                              <AlertCircle size={14} /> Action Required
                          </div>
                          <button 
                            onClick={() => onConfirmReceipt(item.active_rental_id)}
                            className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-orange-100 hover:bg-orange-700 transition"
                          >
                            Confirm Receipt
                          </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-2 text-gray-500 font-bold">
                              <User size={12} />
                              <span>Renter: {item.renter_name || 'User'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 font-bold">
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