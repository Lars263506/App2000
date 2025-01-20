import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">Hjem</Link> | 
      <Link to="/club">Klubboversikt</Link> | 
      <Link to="/login">Logg inn</Link> | 
      <Link to="/register">Registrer deg</Link>
    </nav>
  );
};

export default Navbar;
