import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, Bell, BellDot, Check, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  // 1. Fetch Notifications logic
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Notif Fetch Error", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 45 seconds for new events
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [token]);

  // 2. Mark as read logic
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Mark read error", err);
    }
  };


  const handleNotificationClick = async (notif) => {
    // 1. Mark as read in DB/State
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }

    // 2. Route based on type
    if (notif.type === 'RETURN_CONFIRMED') {
      // Direct the user to their profile with a search param to trigger the modal
      navigate(`/profile?rate=${notif.related_id}`);
    } else if (notif.type === 'ITEM_RENTED') {
      // Direct owner to their dashboard to see the new rental
      navigate('/profile');
    }
    
    setShowNotifs(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">
              OMNI<span className="text-gray-900">RENT</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/browse" className="text-gray-600 hover:text-blue-600 transition hidden sm:block">Browse</Link>
            
            {token ? (
              <div className="flex items-center gap-5 pl-4 border-l border-gray-200">
                
                {/* NOTIFICATION BELL */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`p-2 rounded-xl transition-colors ${unreadCount > 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    {unreadCount > 0 ? <BellDot size={20} className="animate-pulse" /> : <Bell size={20} />}
                  </button>

                  {/* NOTIFICATION DROPDOWN */}
                  {showNotifs && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifs(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 z-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Inbox</h4>
                          {unreadCount > 0 && <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="text-center py-6">
                              <Check className="mx-auto text-gray-200 mb-2" size={24} />
                              <p className="text-xs text-gray-400 font-bold italic">All caught up!</p>
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div 
  key={n.id} 
  onClick={() => handleNotificationClick(n)}
  className={`p-4 rounded-2xl cursor-pointer transition-all border ${n.is_read ? 'bg-white border-gray-50 opacity-60' : 'bg-gray-50 border-blue-100 hover:border-blue-300'}`}
>
                                <div className="flex gap-3">
  {/* Dynamic Icon Container */}
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
    n.type === 'RETURN_CONFIRMED' ? 'bg-green-100 text-green-600' : 
    n.type === 'ITEM_RENTED' ? 'bg-amber-100 text-amber-600' : 
    'bg-blue-100 text-blue-600'
  }`}>
    {n.type === 'ITEM_RENTED' ? <Check size={14} /> : <ShoppingBag size={14} />}
  </div>
  
  <div>
    <p className={`text-[11px] leading-relaxed ${n.is_read ? 'text-gray-500' : 'text-gray-900 font-bold'}`}>
      {n.message}
    </p>
    <p className="text-[9px] text-gray-400 mt-1">
      {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    </p>
  </div>
</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* PROFILE LINK */}
                <Link to="/profile" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 font-black text-xs uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-black">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold uppercase text-[11px] tracking-widest">
                  Login
                </Link>
                <Link to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition font-black uppercase text-[11px] tracking-widest shadow-lg shadow-gray-200">
                  Join
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