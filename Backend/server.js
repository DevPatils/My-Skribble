require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./Routes/UserRouter');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Middleware
app.use(express.json());  // For parsing JSON
app.use(cors());  // Allow requests from any origin (for all domains)


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
