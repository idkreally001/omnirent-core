// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // This tells the server: "It's okay to talk to the React app"
app.use(express.json());

const PORT = 5000;

// This is a simple "Handshake" endpoint
app.get('/api/handshake', (req, res) => {
    res.json({ message: "Hello from the OmniRent Backend! The handshake is successful." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});