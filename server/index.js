const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

// const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)

// Assuming you're using Express.js
app.emit('delete-message', async (data) => {
    const { messageId } = data;
    
    try {
      // Find and delete the message in your database (e.g., MongoDB)
      await Message.findByIdAndDelete(messageId);
  
      // Notify other clients about the deleted message if needed
      io.emit('message-deleted', messageId);
  
      res.status(200).send({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete message' });
    }
  });
  

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})
