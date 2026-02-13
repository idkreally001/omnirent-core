const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/api/routes/auth.routes');
const userRoutes = require('./src/api/routes/user.routes');
const itemRoutes = require('./src/api/routes/item.routes');

const app = express();

// 1. Middlewares FIRST
app.use(cors());
app.use(express.json());

// 2. Logging (Add this to debug!)
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// 3. Routes SECOND
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);

app.listen(5000, () => console.log("✅ Server running on port 5000"));