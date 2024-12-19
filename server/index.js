const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const path = require('path');
const { app, server } = require('./socket/index');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookiesParser());

// Serve static files and handle routes dynamically based on the environment
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, 'client', 'build'); // Ensure this path is correct
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({
            message: 'Server running in development mode',
        });
    });
}

// API endpoints
app.use('/api', router);

// Connect to the database and start the server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
