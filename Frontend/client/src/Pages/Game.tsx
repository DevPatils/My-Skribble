import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Component/Navbar';

interface Player {
  username: string;
}

interface Room {
  id: string;
  players: Player[];
  gameState: string;
}

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // Access the room ID from the URL
  const [room, setRoom] = useState<Room | null>(null); // State to store room details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(''); // Error state

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get<Room>(`http://localhost:5000/api/rooms/getroom/${roomId}`, {
          headers: { 'auth-token': localStorage.getItem('auth-token') }, // Include auth token
        });
        setRoom(response.data);
        setLoading(false);
      } catch {
        setError('Failed to load room details');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
        <div className="text-white text-lg">Loading...</div>
      </div>
    ); // Loading state
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-400 via-orange-500 to-yellow-600">
        <div className="text-white text-lg">{error}</div>
      </div>
    ); // Error state
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Welcome to Room {roomId}
        </h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Game State: </h2>
          <div
            className={`mt-2 text-lg ${
              room?.gameState === 'waiting'
                ? 'text-yellow-500'
                : room?.gameState === 'drawing'
                ? 'text-blue-500'
                : 'text-green-500'
            }`}
          >
            {room?.gameState}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700">Players in Room:</h3>
          <ul className="mt-4 space-y-2">
            {room?.players.map((player, index) => (
              <li key={index} className="text-lg text-gray-800">
                <span className="font-semibold text-purple-600">{player.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default Game;
