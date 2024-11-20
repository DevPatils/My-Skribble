require('dotenv').config();  // Load environment variables from .env file
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./Routes/UserRouter');
const roomRoutes = require('./Routes/RoomeRouter');
const connectDB = require('./config/db');

// Initialize the app
const app = express();

// Create a server for Express (for HTTP API routes)
const apiServer = http.createServer(app);

// Create a separate server for Socket.IO
const socketServer = http.createServer();

// Attach Socket.IO to the socket server
const io = new Server(socketServer, {
  cors: {
    origin: '*', // Allow all origins (adjust for security)
    methods: ['GET', 'POST'],
  },
});

// Attach Socket.IO to the Express app
app.set('io', io);

// Middleware for Express app
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes for the Express app (API routes)
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
    io.to(roomName).emit('message', `User ${socket.id} joined the room`);
  });

  // Drawing updates
  socket.on('drawingUpdate', (data) => {
    io.to(data.roomName).emit('drawingUpdate', data.drawingState);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});



// Start the Express API server
const apiPort = process.env.PORT || 5000;
apiServer.listen(apiPort, () => {
  console.log(`API server running on http://localhost:${apiPort}`);
});

// Start the Socket.IO server
const socketPort = process.env.SOCKET_PORT || 5001;
socketServer.listen(socketPort, () => {
  console.log(`Socket.IO server running on http://localhost:${socketPort}`);
});
