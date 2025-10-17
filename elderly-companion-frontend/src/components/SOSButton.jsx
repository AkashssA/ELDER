// src/components/SOSButton.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SOSButton.css'; // We'll create this file next

const SOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSOSClick = async () => {
    // Ask for confirmation before sending the alert
    if (window.confirm('Are you sure you want to send an emergency alert?')) {
      setIsLoading(true);
      setFeedback('');
      try {
        const res = await axios.post('http://localhost:5000/api/alerts/trigger');
        setFeedback(res.data.msg); // "Emergency alert successfully triggered..."
        alert('Success! Your emergency alert has been sent.');
      } catch (err) {
        setFeedback('Failed to send alert. Please try again.');
        alert('Error! Could not send the alert. Please call for help directly.');
      } finally {
        setIsLoading(false);
        // Clear the feedback message after a few seconds
        setTimeout(() => setFeedback(''), 5000);
      }
    }
  };

  return (
    <div className="sos-container">
      <button
        className="sos-button"
        onClick={handleSOSClick}
        disabled={isLoading}
      >
        {isLoading ? 'SENDING...' : 'SOS'}
      </button>
      <p className="sos-instructions">
        Press in case of an emergency. Your pre-set contacts will be notified.
      </p>
      {feedback && <p className="sos-feedback">{feedback}</p>}
    </div>
  );
};

export default SOSButton;