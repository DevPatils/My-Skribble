import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Player {
  id: string; // Assuming players have an ID
  name: string; // Replace with actual player properties from your backend
}

interface CreateRoomResponse {
  players: Player[];
  gameState: string;
}

interface JoinRoomResponse {
  players: Player[];
  gameState: string;
}

interface StartDrawingResponse {
  message: string;
}

const RoomPage: React.FC = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [gameState, setGameState] = useState<string>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);

  // Get the token from localStorage
  const token = localStorage.getItem('auth-token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to play');
    }
  }, [token]);

  // Create a new room
  const handleCreateRoom = async () => {
    if (!token) {
      setError('You must be logged in to create a room');
      return;
    }

    try {
      const response = await axios.post<CreateRoomResponse>(
        'http://localhost:5000/api/rooms/create',
        { roomName, password },
        { headers: { 'auth-token': token } } // Use 'auth-token' header as per middleware
      );

      setMessage('Room created successfully');
      setPlayers(response.data.players);
      setGameState(response.data.gameState);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Join an existing room
  const handleJoinRoom = async () => {
    if (!token) {
      setError('You must be logged in to join a room');
      return;
    }

    try {
      const response = await axios.post<JoinRoomResponse>(
        'http://localhost:5000/api/rooms/join',
        { roomName, password },
        { headers: { 'auth-token': token } } // Use 'auth-token' header as per middleware
      );

      setMessage('Joined room successfully');
      setPlayers(response.data.players);
      setGameState(response.data.gameState);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Start the drawing phase
  const handleStartDrawing = async () => {
    if (!token) {
      setError('You must be logged in to start the drawing phase');
      return;
    }

    try {
      const response = await axios.post<StartDrawingResponse>(
        'http://localhost:5000/api/rooms/startDrawing',
        { roomName },
        { headers: { 'auth-token': token } } // Use 'auth-token' header as per middleware
      );

      setMessage(response.data.message);
      setGameState('drawing');
    } catch (err) {
      handleApiError(err);
    }
  };

  // Handle API errors
  const handleApiError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Something went wrong');
    } else {
      setError('An unknown error occurred');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Room Game</h1>

      {/* Room Creation */}
      <div className="create-room">
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      {/* Join Room */}
      <div className="join-room">
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>

      {/* Game State and Player List */}
      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="game-state">
        <h3>Game State: {gameState}</h3>
        <h4>Players in Room:</h4>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>

      {/* Start Drawing Button */}
      {gameState === 'waiting' && (
        <button onClick={handleStartDrawing}>Start Drawing</button>
      )}

      {/* Drawing Phase - Display Drawing State */}
      {gameState === 'drawing' && (
        <div className="drawing-phase">
          <h2>Start Drawing the Word!</h2>
          {/* Drawing component can go here */}
        </div>
      )}
    </div>
  );
};

export default RoomPage;
