import React from 'react';
import './TestPage.css'; // Import your CSS file for styling

const Sidebar = ({ timer, questions, onQuestionSelect }) => {
  return (
    <div className="sidebar">
      <div className="timer">
        <p>Time Left:</p>
        <div className="timer-display">
          <span>{timer.hours}</span>:<span>{timer.minutes}</span>:<span>{timer.seconds}</span>
        </div>
      </div>
      <div className="question-navigation">
        {questions.map((q, index) => (
          <button
            key={index}
            className={`question-button ${q.status}`}  // Add class based on status
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
