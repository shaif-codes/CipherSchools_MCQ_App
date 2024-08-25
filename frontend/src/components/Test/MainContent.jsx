import React, { useState, useEffect } from 'react';
import Header from './Header';

const MainContent = ({ test, currentQuestionIndex, setCurrentQuestionIndex }) => {
  const [selectedOption, setSelectedOption] = useState(''); 
  const [reviewedQuestions, setReviewedQuestions] = useState(new Set());
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (test?.questions) {
      const formattedQuestions = test.questions.map((q) => ({
        ...q,
        status: 'not-answered'
      }));
      setQuestions(formattedQuestions);
    }
  }, [test]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].status = 'answered';
    setQuestions(updatedQuestions);
  };

  const handleNavigate = (direction) => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    setSelectedOption(''); // Reset selected option when navigating
  };

  const handleMarkForReview = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].status = 'review';
    setQuestions(updatedQuestions);
    setReviewedQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  };

  if (!currentQuestion) return <div>No questions available</div>;

  return (
    <div className="main-content">
      <Header testTitle={test.title} />
      <div className="question-section">
        <h2 className="question-statement">Question {currentQuestionIndex + 1} <br/>{currentQuestion.question}</h2>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                id={`option${index}`}
                name="answer"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <label htmlFor={`option${index}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="navigation-controls">
        <button className="mark-for-review" onClick={handleMarkForReview}>
          {reviewedQuestions.has(currentQuestionIndex) ? 'Marked' : 'Mark For Review'}
        </button>
        <button className="previous" onClick={() => handleNavigate('previous')} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button className="next" onClick={() => handleNavigate('next')} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MainContent;
