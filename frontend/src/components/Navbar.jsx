import { Link } from 'react-router-dom';
import { User, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">OMNI<span className="text-gray-900">RENT</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">Browse Items</Link>
            
            {/* Conditional Rendering based on Auth State */}
            {token ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold">
                  <User size={18} /> {user?.name || 'Profile'}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;