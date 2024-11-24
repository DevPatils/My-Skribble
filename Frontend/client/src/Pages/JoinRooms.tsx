import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../Component/Navbar';

interface Room {
  _id: string;
  roomName: string;
  players: string[];
  gameState: string;
  currentWord: string;
  drawingPlayer: string;
}

const JoinRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null); // To keep track of the current room the user is in
  const [errorMessage, setErrorMessage] = useState<string>(''); // To store custom error messages

  const authToken = localStorage.getItem('auth-token');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the rooms data from the API
    axios
      .get('http://localhost:5000/api/rooms/all')
      .then((response) => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load rooms');
        setLoading(false);
      });
  }, []);

  const handleJoinRoom = async () => {
    if (!authToken || !selectedRoomId || !password) {
      setError('You need to log in and enter a password to join a room');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/rooms/join',
        { roomId: selectedRoomId, password },
        { headers: { 'auth-token': authToken } }
      );

      // Set the current room ID after successful join
      setCurrentRoomId(selectedRoomId);
      console.log(currentRoomId);
      // Redirect to the game page with the room ID
      navigate(`/game/${selectedRoomId}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Handle specific error when the user is already in the room
        if (err.response.status === 400 && err.response.data.message === 'User is already in the room') {
          setError('You are already in this room');
          navigate(`/game/${selectedRoomId}`); // Redirect to the game page
        } else {
          setError(err.response.data.message || 'Failed to join room');
        }
      } else {
        setError('Failed to join room');
      }
    }

    setShowModal(false);
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!authToken || !roomId) {
      setError('You need to log in to leave the room');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/rooms/leave',
        { roomId },
        { headers: { 'auth-token': authToken } }
      );

      // Reset current room ID after leaving the room
      setCurrentRoomId(null);
      // Redirect the user to the rooms page or home page
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Handle specific error when the user is not in the room
        if (err.response.status === 400 && err.response.data.message === 'You are not in the room') {
          // Show a popup with the error message
          setErrorMessage('You need to join a room first to leave it.');
          setShowModal(true); // This will trigger the modal to appear
        } else {
          setError(err.response.data.message || 'Failed to leave room');
        }
      } else {
        setError('Failed to leave room');
      }
    }
  };

  const openPasswordModal = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal when "Close" button is clicked
    setErrorMessage(''); // Optionally reset error message when modal is closed
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Available Rooms</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room._id} className="bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">{room.roomName}</h3>
                <p className="text-gray-600 mt-3">Current word: {room.currentWord}</p>
                <p className="text-gray-600 mt-3">Game state: {room.gameState}</p>
                <p className="text-gray-600 mt-3">Players: {room.players.length}</p>

                {authToken ? (
                  <>
                    <button
                      onClick={() => openPasswordModal(room._id)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Join Room
                    </button>

                    <button
                      onClick={() => handleLeaveRoom(room._id)}
                      className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Leave Room
                    </button>
                  </>
                ) : (
                  <p className="mt-4 text-red-500">You need to log in to join a room</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No rooms available.</p>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Enter Room Password</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRoom}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Error</h3>
              <p className="text-gray-700 mb-4">{errorMessage}</p>
              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRooms;
