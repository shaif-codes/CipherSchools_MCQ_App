import React from 'react';
import SignupForm from '../../components/Auth/Signup/SignupForm';
import './SignupPage.css';

const SignupPage = () => {

  const handleSignupSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Implement actual signup logic here, e.g., an API request
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Your Account</h2>
        <SignupForm onSubmit={handleSignupSubmit}/>
      </div>
    </div>
  );
};

export default SignupPage;
