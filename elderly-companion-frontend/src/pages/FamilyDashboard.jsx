// src/pages/FamilyDashboard.jsx
import React from 'react';
import PhotoGallery from '../components/PhotoGallery'; // Example component

const FamilyDashboard = ({ onLogout }) => {
  // In the future, this dashboard would fetch the elderly user's health data and display it.
  return (
    <div>
      <button onClick={onLogout} style={{ float: 'right', padding: '10px' }}>Logout</button>
      <h2>Family Member Dashboard</h2>
      <p>Here you can view your loved one's progress and memories.</p>
      <hr />
      <PhotoGallery />
    </div>
  );
};

export default FamilyDashboard;