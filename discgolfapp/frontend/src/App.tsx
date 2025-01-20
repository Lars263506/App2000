import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Sjekk at denne finnes
import Home from "./pages/Home"; // ✅ Sjekk at filen heter nøyaktig "Home.tsx"
import ClubLanding from "./pages/ClubLanding"; // ✅ Må være "ClubLanding.tsx"
import Login from "./pages/Login"; // ✅ Må være "Login.tsx"
import Register from "./pages/Register"; // ✅ Må være "Register.tsx"

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club" element={<ClubLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
