import React from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>My Sidebar</h2>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/services">Services</Link>
      <Link to="/contact">Contact</Link>
    </div>
  );
};

export default Sidebar;