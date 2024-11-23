import React from 'react';
import { useParams } from 'react-router-dom';

const Game: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // Access the room ID from the URL

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Room {roomId}</h1>
    </div>
  );
};

export default Game;
