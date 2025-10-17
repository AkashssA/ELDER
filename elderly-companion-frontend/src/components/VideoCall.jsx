// src/components/VideoCall.jsx
import React from 'react';
import './VideoCall.css';

// In a future step, we would fetch the user's specific link.
// For now, we use a placeholder.
const videoLink = "https://meet.google.com/your-family-room";

const VideoCall = () => (
  <div className="videocall-container">
    <h3>Connect with Family</h3>
    <a href={videoLink} target="_blank" rel="noopener noreferrer" className="videocall-button">
      Start Video Call
    </a>
    <p>This button will open your pre-set family video call room.</p>
  </div>
);
export default VideoCall;