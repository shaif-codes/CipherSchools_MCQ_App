import React from 'react';
import './TestPage.css'; // Import your CSS file for styling

const Header = ({ testTitle }) => {
  return (
    <header className="test-header">
      <h1 align="center" className="test-title" >{testTitle}</h1>
    </header>
  );
};

export default Header;
