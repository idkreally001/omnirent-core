import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 text-gray-900 font-black tracking-tight">
          <Layers size={20} className="text-blue-600" />
          OMNIRENT <span className="text-gray-400 font-bold ml-1 text-sm">© 2026</span>
        </div>

        <nav className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link to="/usage" className="hover:text-gray-900 transition-colors">Usage Agreement</Link>
        </nav>

      </div>
    </footer>
  );
}
