require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./Routes/UserRouter');
const roomRoutes = require('./Routes/RoomeRouter');
const connectDB = require('./config/db');

// Initialize the app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Adjust origin for production
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO and attach to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust for production security)
    methods: ['GET', 'POST'],
  },
});

// Attach the Socket.IO instance to the app for use in routes
app.set('io', io);

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Join a specific room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room: ${roomName}`);
    io.to(roomName).emit('message', `${socket.id} has joined the room`);
  });

  // Real-time drawing updates
  socket.on('drawingUpdate', (data) => {
    const { roomName, drawingState } = data;
    if (!roomName || !drawingState) {
      console.error('Invalid drawing update data:', data);
      return;
    }
    io.to(roomName).emit('drawingUpdate', { drawingState });
    console.log(`Drawing update sent to room ${roomName}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const apiPort = process.env.PORT || 5000;
server.listen(apiPort, () => {
  console.log(`API and Socket.IO server running on http://localhost:${apiPort}`);
});
