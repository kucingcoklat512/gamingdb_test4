import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="py-2 px-2 bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 flex justify-between items-center">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My GameList</h1>
        <div>
          <Link to="/games" className="mr-4 hover:underline">
            Game List
          </Link>
          <Link to="/users" className="mr-4 hover:underline">
            User List
          </Link>
          <button
            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleLogout} // Use the handleLogout function from props
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;