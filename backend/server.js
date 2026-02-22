const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const allowedOrigins = [
  "http://localhost:5173",
  "https://omnirent-core.vercel.app"
];

// Routes
const authRoutes = require('./src/api/routes/auth.routes');
const userRoutes = require('./src/api/routes/user.routes');
const itemRoutes = require('./src/api/routes/item.routes');
const rentalRoutes = require('./src/api/routes/rental.routes');
const notificationRoutes = require('./src/api/routes/notification.routes');
const reviewRoutes = require('./src/api/routes/review.routes');
const messageRoutes = require('./src/api/routes/message.routes');

const initDB = require('./src/db/init');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// 2. ⚡️ SOCKET INJECTION MIDDLEWARE
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 3. Logging
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// 5. Socket Logic
io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // General user room for notifications and new messages
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room: user_${userId}`);
  });

  // --- NEW: FOCUS LOGIC FOR READ RECEIPTS ---
  
  // When a user opens a specific chat
  socket.on('focus_chat', ({ userId, otherId }) => {
    const roomName = `focus_${userId}_${otherId}`;
    socket.join(roomName);
    console.log(`User ${userId} is now FOCUSING on chat with ${otherId}`);
  });

  // When a user leaves a chat or closes the window
  socket.on('blur_chat', ({ userId, otherId }) => {
    const roomName = `focus_${userId}_${otherId}`;
    socket.leave(roomName);
    console.log(`User ${userId} blurred chat with ${otherId}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

// 6. Atomic Startup
const startApp = async () => {
    try {
        await initDB();
        server.listen(PORT, () => {
            console.log(`✅ System Healthy: Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Critical Startup Error:", err);
        process.exit(1);
    }
};

startApp();