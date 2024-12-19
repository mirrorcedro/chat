const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const { app, server, io } = require("./socket/index"); // Ensure `io` is exported correctly
const Message = require("./models/Message"); // Adjust the model import as per your structure

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://chat-spotvibe.vercel.app", // Default to your Vercel frontend
  "http://localhost:3000", // Local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Test Endpoint
app.get("/", (req, res) => {
  res.json({
    message: `Server running at ${PORT}`,
  });
});

// Email Endpoint for Frontend
app.post("/api/email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Add your email handling logic here (e.g., send an email or save to DB)
    res.status(200).json({ message: "Email received successfully." });
  } catch (error) {
    console.error("Error handling email:", error);
    res.status(500).json({ error: "Failed to process the email." });
  }
});

// API Routes
app.use("/api", router);

// Socket Event: Delete Message
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("delete-message", async (data) => {
    const { messageId } = data;

    try {
      // Delete message from database
      await Message.findByIdAndDelete(messageId);

      // Notify all connected clients about the deletion
      io.emit("message-deleted", messageId);

      console.log(`Message deleted: ${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
      socket.emit("error", { error: "Failed to delete message." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to Database and Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at https://chat-37zc.onrender.com/api/email`);
  });
});
