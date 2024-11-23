import React from 'react';
import Navbar from '../Component/Navbar';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16 bg-[#9966ff] text-white">
        <h1 className="text-5xl font-bold">DRAWSS</h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto">
          A fun and exciting drawing and guessing game. One player draws, and others try to guess the word!
        </p>
        {/* Play Now Button */}
        <div className="mt-8">
          <Link to="/play">
            <button className="px-8 py-4 bg-purple-600 text-white text-lg rounded hover:bg-purple-700 transition">
              Play Now
            </button>
          </Link>
        </div>
      </section>

      {/* Game Features Section */}
      <section className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-3xl text-center font-semibold text-gray-800 mb-6">Why Play DRAWSS?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">Exciting Gameplay</h3>
            <p className="text-gray-600 mt-3">
              One player draws a word, and others try to guess it. The faster you guess, the more points you get!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">Multiplayer Fun</h3>
            <p className="text-gray-600 mt-3">
              Play with friends or random people online. The more players, the more fun it gets!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700">Engage Your Creativity</h3>
            <p className="text-gray-600 mt-3">
              Show off your drawing skills or just have fun guessing. No matter your skill level, everyone can play!
            </p>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How to Play</h2>
          <p className="text-lg text-gray-600 mb-4">
            In **DRAWSS**, players take turns drawing a word while others guess it! The player who guesses the word correctly gets points.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mx-auto mb-4 max-w-3xl">
            <li>One player draws a word from a list of random words.</li>
            <li>Other players try to guess the word based on the drawing.</li>
            <li>The faster you guess, the more points you get!</li>
            <li>Have fun and may the best guesser win!</li>
          </ul>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2024 DRAWSS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
