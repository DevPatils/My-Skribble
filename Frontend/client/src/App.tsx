import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Authenticate from "./Pages/Authenticate";
import JoinRooms from "./Pages/JoinRooms";
import MyRooms from "./Pages/MyRooms";
import Game from "./Pages/Game"; // Import the Game page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route path="/my-room" element={<MyRooms />} />
        <Route path="/join-room" element={<JoinRooms />} />
        <Route path="/game/:roomId" element={<Game />} /> {/* Add route for the Game page */}
      </Routes>
    </Router>
  );
}

export default App;
