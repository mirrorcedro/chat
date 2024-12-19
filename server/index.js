const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const path = require('path'); // Import path for serving static files
const { app, server } = require('./socket/index');

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Fallback to localhost in development
        credentials: true,
    })
);
app.use(express.json());
app.use(cookiesParser());

// Dynamic static file serving based on the environment
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.resolve(__dirname, '../client/build');
    app.use(express.static(clientBuildPath));

    // Serve the React app in production
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
} else {
    // Development environment route for testing API
    app.get('/', (req, res) => {
        res.json({
            message: 'Server running in development mode',
        });
    });
}

// API endpoints
app.use('/api', router);

// Dynamic URL handling
const PORT = process.env.PORT || 8080;
const serverURL =
    process.env.NODE_ENV === 'production'
        ? process.env.BACKEND_URL || `https://chatspotvibe.onrender.com/`
        : `http://localhost:${PORT}`;

// Connect to the database and start the server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running at: ${serverURL}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });
