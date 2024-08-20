import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginForm.css';
const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();  // Initialize useNavigate

  const validateForm = () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password }, {withCredentials: true});
      if (response.status !== 200) {
        throw new Error('Login failed');
      }
      // Assuming the response contains the user data and token
      console.log('Login successful:', response.data);

      // Redirect user to the dashboard page after successful login
      navigate('/dashboard');  // Replace '/dashboard' with your actual dashboard route
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password.');
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="login-button">
        Login
      </button>

      <div className="signup-link">
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
    </form>
  );
};

export default LoginForm;
