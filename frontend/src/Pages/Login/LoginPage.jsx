import React from 'react';
import LoginForm from '../../components/Auth/Login/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Your Account</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
