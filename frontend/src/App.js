import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Component/Login/Login';
import LandingPage from './Component/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>

        <Routes>
          <Route path="/landingPage" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
