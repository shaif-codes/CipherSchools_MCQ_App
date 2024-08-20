// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login/LoginPage';
import SignupPage from './Pages/Signup/SignupPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
