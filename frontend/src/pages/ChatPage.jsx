import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { 
  Send, 
  Package, 
  X, 
  ArrowLeft, 
  MessageCircle, 
  Check, 
  CheckCheck 
} from 'lucide-react';

const socket = io('http://localhost:5000');

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [itemContext, setItemContext] = useState(null);
  
  const scrollRef = useRef();

  // 1. Socket Setup & Global Listeners
  useEffect(() => {
    socket.emit('join_room', currentUser.id);

    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (err) { console.error(err); }
    };

    fetchConversations();

    socket.on('new_message', (msg) => {
      // If we are currently chatting with the sender, add message to feed
      if (activeChat === msg.sender_id) {
        setMessages(prev => [...prev, msg]);
        // Immediately notify server/DB that we've seen this
        api.put(`/messages/read/${activeChat}`);
      }
      fetchConversations();
    });

    // Listen for when the OTHER person reads our messages
    socket.on('messages_read', ({ readerId }) => {
      if (activeChat === readerId) {
        setMessages(prev => prev.map(m => ({ 
          ...m, 
          read_at: m.read_at || new Date().toISOString() 
        })));
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('messages_read');
    };
  }, [activeChat, currentUser.id]);

  // 2. Focus Logic & Read Receipt Trigger
  useEffect(() => {
    if (activeChat) {
      // Tell socket I am focused on THIS person
      socket.emit('focus_chat', { userId: currentUser.id, otherId: activeChat });

      // Mark messages as read in Database
      api.put(`/messages/read/${activeChat}`);

      return () => socket.emit('blur_chat', { userId: currentUser.id, otherId: activeChat });
    }
  }, [activeChat, currentUser.id]);

  // 3. URL Parameter Handling
  useEffect(() => {
    const ownerId = searchParams.get('owner');
    const itemId = searchParams.get('item');

    if (ownerId) {
      setActiveChat(parseInt(ownerId));
      if (itemId) fetchItemContext(itemId);
    }
  }, [searchParams]);

  // 4. Message History Loading
  useEffect(() => {
    if (activeChat) {
      const fetchHistory = async () => {
        try {
          const res = await api.get(`/messages/${activeChat}`);
          setMessages(res.data);
        } catch (err) { console.error(err); }
      };
      fetchHistory();
    }
  }, [activeChat]);

  // 5. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchItemContext = async (id) => {
    try {
      const res = await api.get(`/items/${id}`);
      setItemContext(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const payload = {
        receiverId: activeChat,
        content: newMessage,
        itemId: itemContext?.id || null
      };

      const res = await api.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) { console.error(err); }
  };

  // Helper: Render status ticks with high-contrast colors
  const renderTicks = (msg) => {
    if (msg.sender_id !== currentUser.id) return null;
    return (
      <span className="ml-1 inline-flex align-middle">
        {msg.read_at ? (
          <CheckCheck size={14} className="text-blue-400" /> 
        ) : (
          <Check size={14} className="text-gray-400" /> 
        )}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="bg-white w-full max-w-6xl h-full max-h-[800px] rounded-[3.5rem] shadow-2xl overflow-hidden flex relative border border-white/20">
        
        {/* Close Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 right-8 z-50 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all text-gray-400"
        >
          <X size={20} />
        </button>

        {/* Sidebar: Conversations */}
        <div className="hidden md:flex w-80 border-r border-gray-50 flex-col bg-gray-50/50">
          <div className="p-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Inbox</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Recent Handshakes</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
            {conversations.map(conv => (
              <button
                key={conv.other_user_id}
                onClick={() => setActiveChat(conv.other_user_id)}
                className={`w-full p-4 rounded-[2rem] transition-all flex items-center gap-4 ${
                  activeChat === conv.other_user_id ? 'bg-white shadow-lg border border-gray-100 scale-[1.02]' : 'hover:bg-white/50'
                }`}
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shrink-0">
                  {conv.full_name?.charAt(0)}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 text-sm truncate">{conv.full_name}</p>
                  <p className="text-[11px] text-gray-400 truncate font-medium">{conv.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-50 flex items-center justify-between pr-20">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="md:hidden p-2 text-gray-400"><ArrowLeft size={20}/></button>
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">
                    {conversations.find(c => c.other_user_id === activeChat)?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 leading-none">
                      {conversations.find(c => c.other_user_id === activeChat)?.full_name || 'User'}
                    </h4>
                    <p className="text-[10px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active Now
                    </p>
                  </div>
                </div>

                {itemContext && (
                  <div className="hidden sm:flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 max-w-[250px]">
                    <Package size={16} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] font-black text-blue-900 truncate uppercase tracking-tighter">
                      {itemContext.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar bg-gray-50/10">
                {messages.length === 0 && (
                   <div className="text-center py-20 opacity-20">
                     <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
                   </div>
                )}
                {messages.map((msg, idx) => {
                  const isMine = msg.sender_id === currentUser.id;
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[75%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                        isMine 
                          ? 'bg-gray-900 text-white rounded-br-none' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        {msg.content}
                        
                        <div className={`flex items-center gap-1 mt-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <p className={`text-[8px] font-bold uppercase tracking-tighter ${isMine ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {renderTicks(msg)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-8 pt-4 flex gap-4">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg active:scale-90 disabled:opacity-30"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
              <MessageCircle size={64} strokeWidth={1} />
              <h3 className="text-2xl font-black mt-4">Select a Handshake</h3>
              <p className="font-bold max-w-xs mt-2">Communication is the key to a safe rental.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}