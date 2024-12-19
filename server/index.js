const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const { app, server } = require('./socket/index');

// Middleware for CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://chat-spotvibe.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors({
    origin: process.env.FRONTEND_URL || 'https://chat-spotvibe.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Other Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: "Server running at " + PORT
    });
});

// Connect to Database and Start Server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
});
