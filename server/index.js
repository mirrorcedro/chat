const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const path = require('path'); // Import path for serving static files
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
    const clientBuildPath = path.resolve(__dirname, '../client/build');  // Correct path
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

// Connect to the database and start the server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
