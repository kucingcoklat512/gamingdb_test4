import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar"; // Ensure this is imported
import GameList from "./components/GameList"; // Ensure this is imported
import UserList from "./components/UserList"; // Ensure this is imported
import Login from "./components/Login"; // Ensure this is imported
import Dashboard from "./components/Dashboard"; // Ensure this is imported
import DeveloperList from "./components/DeveloperList";
import GenreList from "./components/GenreList"; // Ensure this is imported
import PublisherList from "./components/PublisherList"; // Ensure this is imported
import RatingList from "./components/RatingList"; // Ensure this is imported
const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <Router>
      <div>
        {token ? (
          <>
            {/*<Navbar handleLogout={handleLogout} /> {/* Include Navbar for navigation */}
            <Routes>
              <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
              <Route path="/games" element={<GameList handleLogout={handleLogout} />} />
              <Route path="/users" element={<UserList handleLogout={handleLogout} />} />
              <Route path="/developers" element={<DeveloperList handleLogout={handleLogout} />} />
              <Route path="/genres" element={<GenreList handleLogout={handleLogout} />} />
              <Route path="/publishers" element={<PublisherList handleLogout={handleLogout} />} />
              <Route path="/ratings" element={<RatingList handleLogout={handleLogout} />} />

            </Routes>
          </>
        ) : (
          <Login setToken={setToken} />
        )}
      </div>
    </Router>
  );
};

export default App;