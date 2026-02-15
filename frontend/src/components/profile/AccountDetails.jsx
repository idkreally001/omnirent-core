import { Mail, Calendar } from 'lucide-react';

export default function AccountDetails({ user }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <h3 className="text-xl font-black mb-6 text-gray-900">Account Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <InfoItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
        <InfoItem icon={<Calendar size={20}/>} label="Member Since" value={new Date(user.created_at).toLocaleDateString()} />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
      <div className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1 leading-none">{label}</p>
        <p className="font-bold text-gray-800 leading-none truncate">{value}</p>
      </div>
    </div>
  );
}