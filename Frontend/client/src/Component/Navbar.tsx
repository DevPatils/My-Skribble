import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Check for auth token
  const authToken = localStorage.getItem('auth-token');

  const handleLogout = () => {
    // Remove the auth token
    localStorage.removeItem('auth-token');
    // Navigate to home
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MyLogo
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/my-rooms">
            <button className="px-4 py-2 text-gray-800 border border-gray-800 rounded hover:bg-gray-100">
              My Rooms
            </button>
          </Link>
          <Link to="/join-room">
            <button className="px-4 py-2 text-gray-800 border border-gray-800 rounded hover:bg-gray-100">
              Join Room
            </button>
          </Link>

          {/* Auth Button */}
          {authToken ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth">
              <button className="px-4 py-2 text-white bg-[#9966ff] rounded hover:bg-purple-700">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
