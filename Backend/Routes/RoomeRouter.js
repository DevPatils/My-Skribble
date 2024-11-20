const express = require('express');
const Room = require('../Models/RoomModel');
const User = require('../Models/UserModel');
const verifyToken = require('../Middleware/auth');  // Import the verifyToken middleware
const roomrouter = express.Router();

// Sample list of words (this could be extended or dynamic)
const wordsList = ['apple', 'banana', 'car', 'dog', 'house', 'tree'];

// Function to randomly select a player from the room
function getRandomPlayer(players) {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

// Create a new room with a room name and password (requires JWT)
roomrouter.post('/create', verifyToken, async (req, res) => {
  const { roomName, password } = req.body;
  const userId = req.userId;  // Get user ID from the token

  if (!roomName || !userId || !password) {
    return res.status(400).json({ message: 'Room name, user ID, and password are required' });
  }

  try {
    // Check if the room already exists
    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room with this name already exists' });
    }

    // Create the new room with password
    const newRoom = new Room({
      roomName,
      players: [userId], // Add the user who created the room
      password, // Store the password for later use
      gameState: 'waiting', // Initial game state
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join an existing room (with password verification)
roomrouter.post('/join', verifyToken, async (req, res) => {
  const { roomName, password } = req.body;
  const userId = req.userId;  // Get user ID from the token

  if (!roomName || !userId || !password) {
    return res.status(400).json({ message: 'Room name, user ID, and password are required' });
  }

  try {
    // Find the room by name
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the password is correct
    if (room.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Check if the user is already in the room
    if (room.players.includes(userId)) {
      return res.status(400).json({ message: 'User is already in the room' });
    }

    // Add the user to the room
    room.players.push(userId);
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room details (players and current state)
roomrouter.get('/:roomName', verifyToken, async (req, res) => {
  const { roomName } = req.params;

  try {
    // Find the room and populate the players
    const room = await Room.findOne({ roomName }).populate('players', 'username');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a room (e.g., if a player disconnects or exits)
roomrouter.post('/leave', verifyToken, async (req, res) => {
  const { roomName, userId } = req.body;

  if (!roomName || !userId) {
    return res.status(400).json({ message: 'Room name and user ID are required' });
  }

  try {
    // Find the room
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Remove the user from the room
    room.players = room.players.filter(player => player.toString() !== userId);
    await room.save();

    res.status(200).json({ message: 'User left the room successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the drawing phase: randomly select a player to draw and assign a word

roomrouter.post('/startDrawing', verifyToken, async (req, res) => {
  const { roomName } = req.body;

  try {
    // Find the room and populate the players
    const room = await Room.findOne({ roomName }).populate('players');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Ensure there are enough players in the room
    if (room.players.length < 2) {
      return res.status(400).json({ message: 'Not enough players to start the game' });
    }

    // Randomly select a player to draw
    const drawingPlayer = getRandomPlayer(room.players);
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];

    // Set the drawing player and word
    room.drawingPlayer = drawingPlayer._id; // Ensure this is set to a valid player ID
    room.currentWord = randomWord;
    room.gameState = 'drawing';

    await room.save();

    // Notify players (you can extend this with real-time socket notifications)
    res.status(200).json({
      message: `Player ${drawingPlayer.username} is drawing the word!`,
      word: room.currentWord,
      drawingPlayer: drawingPlayer.username,
      gameState: room.gameState,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Save the drawing state
roomrouter.post('/saveDrawing', verifyToken, async (req, res) => {
  const { roomName, drawingState } = req.body;
  const userId = req.userId;  // Extract user ID from token

  if (!roomName || !drawingState) {
    return res.status(400).json({ message: 'Room name and drawing state are required' });
  }

  try {
    // Find the room by room name
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the drawingPlayer is set
    if (!room.drawingPlayer) {
      return res.status(400).json({ message: 'No player has been assigned to draw' });
    }

    // Check if the user is the current drawing player
    if (room.drawingPlayer.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update the drawing state' });
    }

    // Update the drawing state in the room
    room.drawingState = drawingState;
    await room.save();

    // Emit the drawing update to all connected users in the room
    req.app.get('io').to(roomName).emit('drawingUpdate', { drawingState });

    // Respond with a success message
    res.status(200).json({ message: 'Drawing state updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

roomrouter.post('/guessWord', verifyToken, async (req, res) => {
  const { roomName, guess } = req.body;
  const userId = req.userId;  // Extract user ID from token

  if (!roomName || !guess) {
    return res.status(400).json({ message: 'Room name and guess are required' });
  }

  try {
    // Find the room by room name
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the current word matches the guess
    if (room.currentWord === guess) {
      // Update the game state to 'waiting' and clear the drawing state
      room.gameState = 'waiting';
      room.drawingState = null;
      await room.save();

      // Emit the word guess to all connected users in the room
      req.app.get('io').to(roomName).emit('wordGuessed', { guess });

      // Respond with a success message
      res.status(200).json({ message: 'Word guessed correctly!' });
    } else {
      res.status(400).json({ message: 'Incorrect guess' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = roomrouter;
