import { Mail, Calendar } from 'lucide-react';

export default function AccountDetails({ user }) {
  return (
    <div className="bg-bg-secondary rounded-[2.5rem] border border-border-subtle shadow-2xl shadow-blue-500/5 p-8 transition-colors">
      <h3 className="text-xl font-black mb-6 text-text-primary uppercase tracking-tight">Account Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
        <InfoItem icon={<Calendar size={20}/>} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-bg-primary border border-border-subtle rounded-2xl group hover:border-blue-600/30 transition-all duration-300">
      <div className="text-text-secondary group-hover:text-blue-600 transition-colors flex-shrink-0">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-1.5 leading-none">{label}</p>
        <p className="font-bold text-text-primary leading-none truncate">{value}</p>
      </div>
    </div>
  );
}