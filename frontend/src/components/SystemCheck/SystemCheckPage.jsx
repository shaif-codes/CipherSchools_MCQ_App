import React, { useState, useRef } from 'react';
import './SystemCheckPage.css'; // CSS for styling
import { FaWifi, FaMicrophone, FaCamera } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SystemCheckPage = () => {
  const { testId } = useParams(); // Get testId from URL
  const navigate = useNavigate(); // For navigation
  const [micPermission, setMicPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [micMessage, setMicMessage] = useState("");
  const [cameraMessage, setCameraMessage] = useState("");
  const [isAudioCheckComplete, setIsAudioCheckComplete] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Request microphone access
  const checkMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setMicPermission(true);
        setMicMessage("Microphone permission granted");
      })
      .catch(() => {
        setMicPermission(false);
        setMicMessage("Microphone permission denied");
      });
  };

  // Request camera access and display video preview
  const checkCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setCameraPermission(true);
        setCameraMessage("Camera permission granted");
        setIsCameraActive(true);

        // Display video stream in video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        setCameraPermission(false);
        setCameraMessage("Camera permission denied");
      });
  };

  const handleAudioCheck = () => {
    // Simulating audio check
    setIsAudioCheckComplete(true);
  };

  const handleStartTest = async () => {
    if (micPermission && cameraPermission && isAudioCheckComplete) {
      try {
        // Send system check status to the backend
        const response = await axios.post(`${API_URL}/api/system-check/system-check`, { testId }, {
          withCredentials: true
        });

        if (response.status === 200) {
          // Store the system check token in session storage
          sessionStorage.setItem('systemCheckToken', response.data.token);

          // Redirect to the test page
          navigate(`/test/${testId}`);
        } else {
          console.error('System check failed.');
        }
      } catch (error) {
        console.error('Error starting test:', error);
      }
    } else {
      alert("Please complete all system checks before starting the test.");
    }
  };

  return (
    <div className="system-check-page">
      <h1>System Compatibility Check</h1>

      <div className="system-check-section">
        <FaWifi className="icon" />
        <h3>Network Speed</h3>
        <p>Check if you have a decent internet speed. This can be done by logging into your email account. A decent internet connection should enable you to log in within seconds.</p>
      </div>

      <div className="system-check-section">
        <FaMicrophone className="icon" />
        <h3>Microphone</h3>
        <p>Read the below sentence and click on the button for your audio check.</p>
        <blockquote>"Hi there, I am [Your Name] and I am ready for this test!"</blockquote>
        <button onClick={checkMicrophone} className="system-check-button">Check Microphone</button>
        <p>{micMessage}</p>

        {micPermission && (
          <button onClick={handleAudioCheck} className="system-check-button">
            Complete Audio Check
          </button>
        )}

        {isAudioCheckComplete && <p>Audio check complete!</p>}
      </div>

      <div className="system-check-section">
        <FaCamera className="icon" />
        <h3>Webcam</h3>
        <p>Follow the below instructions to capture your base profile picture:</p>
        <ul>
          <li>Please select a room with sufficient light to ensure visibility.</li>
          <li>Position yourself in front of the webcam. Ensure that your face is fully visible in the camera screen (forehead, eyes, ears, nose, lips must be visible).</li>
        </ul>
        <button onClick={checkCamera} className="system-check-button">
          {cameraMessage === "Camera permission granted" ? "Check Camera Preview" : "Check Webcam"}
        </button>
        <p>{cameraMessage}</p>

        {isCameraActive && (
          <div className="camera-preview">
            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
          </div>
        )}
        <button className="start-test-button" onClick={handleStartTest} disabled={!(micPermission && cameraPermission && isAudioCheckComplete)}>
          Start Test
        </button>
      </div>
    </div>
  );
};

export default SystemCheckPage;
