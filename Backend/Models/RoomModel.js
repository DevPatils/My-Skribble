const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  password: { type: String, required: true }, // New password field
  gameState: { type: String, enum: ['waiting', 'drawing', 'guessing'], default: 'waiting' },
  drawingPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentWord: { type: String },
});

module.exports = mongoose.model('Room', roomSchema);
