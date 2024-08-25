import React, { useState, useEffect } from 'react';
import MainContent from './MainContent';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TestPage.css';
import axios from 'axios';

const TestPage = () => {
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [timer, setTimer] = useState({ hours: '01', minutes: '59', seconds: '40' });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tests/${testId}`, { withCredentials: true });
        if (response.status !== 200) {
          alert('Failed to fetch test data');
          throw new Error('Failed to fetch test data');
        }

        setTestData(response.data);

        const formattedQuestions = response.data.questions.map((q) => ({
          text: q.question,
          options: q.options,
          status: 'not-answered',
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch test data');
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId, API_URL]);

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="test-page">
      <MainContent
        test={testData}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex} // Pass setter for navigation
        questions={questions}
      />
      <Sidebar
        timer={timer}
        questions={questions}
        onQuestionSelect={handleQuestionSelect}
        currentQuestionIndex={currentQuestionIndex} // Pass current question index for active state
      />
    </div>
  );
};

export default TestPage;
