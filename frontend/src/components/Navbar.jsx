import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, BellDot, Check, ShoppingBag, MessageCircle, MessageSquare, Trash2, ShieldCheck, Search } from 'lucide-react';
import api from '../api/axios';
import socket from '../socket';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

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
    if (!token || !user) return;

    socket.emit('join_room', user.id);
    
    // eslint-disable-next-line
    fetchNotifications();

    const handleNewNotification = (notif) => {
      // eslint-disable-next-line
      setNotifications(prev => [notif, ...prev]);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => console.log("Sound blocked by browser policy"));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
    // eslint-disable-next-line
  }, [token, user?.id]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Mark read error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Mark all read error", err);
    }
  };

  const clearHistory = async () => {
    try {
      await api.delete('/notifications/cleanup');
      setNotifications(prev => prev.filter(n => !n.is_read));
    } catch (err) {
      console.error("Clear history error", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }

    if (notif.type === 'RETURN_CONFIRMED') {
      navigate(`/profile?rate=${notif.related_id}`);
    } else if (notif.type === 'ITEM_RENTED') {
      navigate('/profile');
    } else if (notif.type === 'NEW_MESSAGE') {
      navigate(`/messages?owner=${notif.related_id}`);
    }
    
    setShowNotifs(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasReadNotifs = notifications.some(n => n.is_read);

  return (
    <nav className="bg-bg-secondary border-b border-border-subtle sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">
              OMNI<span className="text-text-primary">RENT</span>
            </span>
          </Link>

          <div className="flex items-center space-x-6 text-sm font-medium">
            <form onSubmit={handleGlobalSearch} className="hidden lg:flex relative items-center">
              <Search className="absolute left-3 text-text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-bg-primary border border-border-subtle rounded-full text-xs font-bold w-48 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-blue-500 text-text-primary placeholder:text-text-secondary"
              />
            </form>

            <Link to="/browse" className="text-text-secondary hover:text-blue-600 transition hidden sm:block">Browse</Link>
            
            <ThemeToggle />

            {token ? (
              <div className="flex items-center gap-5 pl-4 border-l border-border-subtle">
                {user?.is_admin && (
                  <Link 
                    to="/admin" 
                    title="Admin Dashboard"
                    className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors"
                  >
                    <ShieldCheck size={20} />
                  </Link>
                )}
                <Link 
                  to="/messages" 
                  className="p-2 text-text-secondary hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <MessageCircle size={20} />
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`p-2 rounded-xl transition-colors ${unreadCount > 0 ? 'bg-blue-50 text-blue-600' : 'text-text-secondary hover:bg-bg-primary'}`}
                  >
                    {unreadCount > 0 ? <BellDot size={20} className="animate-pulse" /> : <Bell size={20} />}
                  </button>

                  {showNotifs && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifs(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 bg-bg-secondary border border-border-subtle shadow-2xl rounded-[2rem] p-6 z-50">
                        
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Inbox</h4>
                          
                          <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                              <button 
                                onClick={markAllAsRead}
                                className="text-[9px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Mark all as read
                              </button>
                            )}
                            {hasReadNotifs && (
                              <button 
                                onClick={clearHistory}
                                title="Clear read notifications"
                                className="text-text-secondary hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="text-center py-6">
                              <Check className="mx-auto text-text-secondary opacity-30 mb-2" size={24} />
                              <p className="text-xs text-text-secondary font-bold italic">All caught up!</p>
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => handleNotificationClick(n)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all border ${n.is_read ? 'bg-bg-secondary border-border-subtle opacity-50' : 'bg-bg-primary border-blue-100 dark:border-blue-900/30 hover:border-blue-300'}`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    n.type === 'RETURN_CONFIRMED' ? 'bg-green-100/50 text-green-600' : 
                                    n.type === 'ITEM_RENTED' ? 'bg-amber-100/50 text-amber-600' : 
                                    n.type === 'NEW_MESSAGE' ? 'bg-purple-100/50 text-purple-600' :
                                    'bg-blue-100/50 text-blue-600'
                                  }`}>
                                    {n.type === 'ITEM_RENTED' ? <Check size={14} /> : 
                                     n.type === 'NEW_MESSAGE' ? <MessageSquare size={14} /> : 
                                     <ShoppingBag size={14} />}
                                  </div>
                                  
                                  <div>
                                    <p className={`text-[11px] leading-relaxed ${n.is_read ? 'text-text-secondary' : 'text-text-primary font-bold'}`}>
                                      {n.message}
                                    </p>
                                    <p className="text-[9px] text-text-secondary mt-1">
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

                <Link to="/profile" className="flex items-center gap-2 text-text-primary hover:text-blue-600 font-black text-xs uppercase tracking-wider">
                  <div className="w-8 h-8 bg-text-primary text-bg-primary rounded-full flex items-center justify-center font-black">
                    {user?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user?.full_name || user?.name || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-border-subtle">
                <Link to="/login" className="flex items-center gap-2 text-text-secondary hover:text-blue-600 font-bold uppercase text-[11px] tracking-widest transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-text-primary text-bg-primary px-6 py-2.5 rounded-xl hover:bg-blue-600 transition font-black uppercase text-[11px] tracking-widest shadow-lg shadow-blue-500/10">
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