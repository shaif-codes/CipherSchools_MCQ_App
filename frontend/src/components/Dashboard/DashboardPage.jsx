import React, { useState, useEffect } from 'react';
import './DashboardPage.css'; // CSS for styling
import axios from 'axios';
import { FaUser, FaSignOutAlt, FaClipboardList } from 'react-icons/fa'; // Icons for navigation


const API_URL = import.meta.env.VITE_API_URL;


const DashboardPage = () => {
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch available tests from backend
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tests`, {
          withCredentials: true // Ensure cookies are sent with the request
        });
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests", error);
        // if error is unauthorized, redirect to login page
        if (error.response && error.response.status === 401) {
          window.location.href = '/';
        }
      }
    };
    fetchTests();
  }, []);

  // Filter tests based on searchQuery
  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out", error);
    }
    };

    const handleStartTest = (testId) => {
        console.log("Starting test", testId);
        window.location.href = `/system-check/${testId}`;
    };

  return (
    <div className="dashboard-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <div className="logo">
          <h2>MCQify</h2>
        </div>
        <nav className="nav-links">
          <a href="/profile">
            <FaUser className="nav-icon" /> My Profile
          </a>
          <a href="/results">
            <FaClipboardList className="nav-icon" /> Results
          </a>
          <a onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" /> Logout
          </a>
        </nav>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <div className='dashboard-top'>
            <h1 className="dashboard-title">Available Tests</h1>
            <input 
            type="text" 
            placeholder="Search for a test..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="search-bar"
            />
        </div>
        <div className="test-list">
          {filteredTests.map(test => (
            <div key={test._id} className="test-item">
              <h3 align="center">{test.title}</h3>
              <p>{test.description}</p>
              <button onClick={() => handleStartTest(test._id)} className="enter-test-btn">
                Enter Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
