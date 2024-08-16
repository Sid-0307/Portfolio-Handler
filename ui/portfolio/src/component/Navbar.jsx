import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/portfolio" className="link navbar-link">
        Portfolio
      </Link>
      <Link to="/explore" className="link navbar-link">
        Explore
      </Link>
      <Link to="/transaction" className="link navbar-link">
        Transaction
      </Link>
    </div>
  );
};

export default Navbar;
