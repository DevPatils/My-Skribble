require('dotenv').config(); // Load .env variables
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
