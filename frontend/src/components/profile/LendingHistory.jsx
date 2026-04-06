import { CheckCircle2, Package, User } from 'lucide-react';

export default function LendingHistory({ myLendings }) {
  const completedLendings = myLendings.filter(l => l.status === 'completed');

  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Earnings Log</h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-green-600 bg-green-600/10 border border-green-600/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">
            Total: {completedLendings.reduce((acc, curr) => acc + Number(curr.total_price), 0).toFixed(2)}₺
          </span>
          <span className="text-[9px] font-black text-text-secondary bg-bg-primary border border-border-subtle px-3 py-1.5 rounded-xl uppercase tracking-widest">
            {completedLendings.length} completed
          </span>
        </div>
      </div>

      {completedLendings.length === 0 ? (
        <div className="text-center py-12 bg-bg-primary rounded-[2rem] border-2 border-dashed border-border-subtle">
          <CheckCircle2 className="mx-auto text-text-secondary opacity-30 mb-4" size={48} />
          <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">No lending history yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          <div className="space-y-4">
            {completedLendings.map(lending => (
              <div key={lending.id} className="flex items-center justify-between p-5 bg-bg-primary rounded-[2rem] border border-border-subtle transition-all duration-300 hover:border-green-600/30">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-14 h-14 bg-bg-secondary border border-border-subtle rounded-2xl flex items-center justify-center text-text-secondary overflow-hidden flex-shrink-0 shadow-sm">
                    {lending.image_url ? <img src={lending.image_url} alt="" className="object-cover w-full h-full" /> : <Package size={24} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-text-primary text-sm truncate uppercase tracking-tight">{lending.title}</p>
                    <div className="flex items-center gap-2 text-[9px] text-text-secondary font-black uppercase tracking-widest mt-1">
                      <User size={12} className="text-blue-500" />
                      Lent to {lending.renter_name}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-sm font-black text-green-600 tracking-tighter">+{lending.total_price}₺</p>
                  <span className="text-[8px] font-black uppercase tracking-widest text-green-600 bg-green-600/10 border border-green-600/20 px-2.5 py-1 rounded-lg mt-1 inline-block">Earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}