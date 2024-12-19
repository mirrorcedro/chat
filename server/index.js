const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const { app, server, io } = require('./socket/index'); // Ensure io is imported from your socket implementation
const Message = require('./models/Message'); // Import your Message model

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://chat-spotvibe.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Server port
const PORT = process.env.PORT || 8080;

// Root route
app.get('/', (req, res) => {
    res.json({
        message: "Server running at " + PORT
    });
});

// API routes
app.use('/api', router);

// Socket event for deleting a message
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('delete-message', async (data) => {
        const { messageId } = data;

        try {
            // Find and delete the message from the database
            await Message.findByIdAndDelete(messageId);

            // Notify all clients about the deleted message
            io.emit('message-deleted', messageId);
        } catch (error) {
            console.error('Failed to delete message:', error);
            socket.emit('error', { message: 'Failed to delete message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Database connection and server start
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
});
