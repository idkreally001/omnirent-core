import { Link } from 'react-router-dom';
import { Layers, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle bg-bg-secondary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/copyright" className="flex items-center gap-2 group transition-all duration-300">
              <Layers size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="text-text-primary font-black tracking-tight uppercase text-base">OMNIRENT</span>
                <span className="text-text-secondary font-black text-[9px] uppercase tracking-widest opacity-60">© 2026 Platform</span>
              </div>
            </Link>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
              Built for the community, by the community.
            </p>
          </div>

          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-text-secondary">
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/copyright" className="hover:text-blue-600 transition-colors">Copyright</Link>
            <Link to="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            <Link to="/usage" className="hover:text-text-primary transition-colors">Usage</Link>
            <a 
              href="https://github.com/idkreally001/omnirent-core" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-primary rounded-full hover:bg-blue-600 transition-all scale-95 hover:scale-100"
            >
              <Github size={14} />
              GitHub
            </a>
          </nav>

        </div>
      </div>
    </footer>
  );
}
