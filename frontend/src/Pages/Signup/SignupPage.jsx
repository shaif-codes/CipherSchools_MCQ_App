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
        <SignupForm onSubmit={handleSignupSubmit}/>
    </div>
  );
};

export default SignupPage;
