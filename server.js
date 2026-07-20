const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const mongoose = require('mongoose');

// Connect to MongoDB (ensure you have MongoDB installed or use MongoDB Atlas)
mongoose.connect('mongodb+srv://bilalebiola22_db:arisekola22@cluster0.yogcs6g.mongodb.net/?appName=Cluster0');

// Define the Message Schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

io.on('connection', async (socket) => {
  console.log('Someone joined!');

  // Send historical messages to the new user
  const history = await Message.find().sort({ timestamp: 1 }).limit(50);
  socket.emit('chat history', history);

  socket.on('chat message', async (data) => {
    // Save to database
    const newMessage = new Message(data);
    await newMessage.save();
    
    // Broadcast to everyone
    io.emit('chat message', data);
  });
});

http.listen(3000, () => {
  console.log('Server is running live on port 3000 with Database');
});
const corsOptions = {
  origin: [
    "https://anonymous-frontend-eight.vercel.app", // Your new Vercel URL
    "http://localhost:3000" // Keep this for local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));