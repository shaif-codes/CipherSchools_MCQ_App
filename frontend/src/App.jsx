// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login/LoginPage';
import SignupPage from './Pages/Signup/SignupPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import SystemCheckPage from './components/SystemCheck/SystemCheckPage';
import TestPage from './components/Test/TestPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/system-check/:testId" element={<SystemCheckPage />} />
        <Route path="/test/:testId" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
