const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const { app, server } = require('./socket/index');

// CORS Configuration
const allowedOrigins = [
  "https://chat-spotvibe.vercel.app", // Frontend hosted on Vercel
  "http://localhost:3000", // Local development
];

// Set up CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS error: Origin not allowed."));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Methods allowed
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
    credentials: true, // Allow cookies to be sent
  })
);

// Handle OPTIONS requests (preflight requests)
app.options('*', cors());

// Use JSON and cookie parsing middleware
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Test Endpoint
app.get('/', (req, res) => {
  res.json({
    message: `Server running at ${PORT}`,
  });
});

// API Routes
app.use('/api', router);

// Connect to the database and start the server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at https://chat-backend-wheat-seven.vercel.app/api`);
  });
});
