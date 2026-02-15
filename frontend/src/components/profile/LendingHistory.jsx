import { CheckCircle2, Package, User } from 'lucide-react';

export default function LendingHistory({ myLendings }) {
  const completedLendings = myLendings.filter(l => l.status === 'completed');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900">Lending History</h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
  Total Earned: {completedLendings.reduce((acc, curr) => acc + Number(curr.total_price), 0).toFixed(2)}₺
</span>
          <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            {completedLendings.length} completed
          </span>
        </div>
      </div>

      {completedLendings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <CheckCircle2 className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-gray-400 font-bold text-sm">No completed lendings yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
        <div className="space-y-4">
          {completedLendings.map(lending => (
            <div key={lending.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 opacity-75">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
                  {lending.image_url ? <img src={lending.image_url} alt="" className="object-cover w-full h-full" /> : <Package size={20} />}
                </div>
                <div>
                  <p className="font-bold text-gray-500 text-sm line-clamp-1">{lending.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                    <User size={12} className="text-blue-400" />
                    Lent to {lending.renter_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400">+{lending.total_price}₺</p>
                <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Earned</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}