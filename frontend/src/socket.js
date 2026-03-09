import { io } from "socket.io-client";

// 1. Determine the base URL (removing /api suffix if present)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socketUrl = apiUrl.replace(/\/api$/, ''); 

const socket = io(socketUrl, {
  withCredentials: true,
  // 2. Allow polling as a fallback for better compatibility
  transports: ['polling', 'websocket'] 
});

// 3. Add debug logs (Temporary - check your browser console for these!)
socket.on('connect', () => console.log('✅ Socket Connected:', socket.id));
socket.on('connect_error', (err) => console.error('❌ Socket Connection Error:', err.message));

export default socket;