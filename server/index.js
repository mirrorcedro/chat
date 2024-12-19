const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index');

// CORS Configuration: Allow both the frontend URL and local development
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'https://chat-1-7oju.onrender.com',  // Add your deployed frontend URL
        'http://localhost:3000'  // Allow local development URL
    ],
    credentials: true  // Enable credentials (cookies, authorization headers, etc.)
}));

// Parse incoming JSON and cookies
app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

// Health check route
app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    });
});

// API endpoints
app.use('/api', router);

// Socket.io CORS configuration
const io = require('socket.io')(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'https://chat-1-7oju.onrender.com',  // Add your deployed frontend URL
            'http://localhost:3000'  // Allow local development URL
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Socket.io event example (delete message)
io.on('connection', (socket) => {
    console.log('New connection established');

    socket.on('delete-message', async (data) => {
        const { messageId } = data;
        
        try {
            // Assuming you're using a database like MongoDB, find and delete the message
            await Message.findByIdAndDelete(messageId);

            // Notify other clients about the deleted message
            io.emit('message-deleted', messageId);

            socket.emit('message-deleted-success', { message: 'Message deleted successfully' });
        } catch (error) {
            socket.emit('error', { message: 'Failed to delete message', error });
        }
    });
});

// Connect to database and start the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
});
