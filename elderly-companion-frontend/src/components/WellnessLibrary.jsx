// src/components/WellnessLibrary.jsx
import React, { useState } from 'react';
import { yogaPoses, prayers } from '../data/wellnessData';
import './WellnessLibrary.css';

const WellnessLibrary = () => {
  const [activeTab, setActiveTab] = useState('yoga'); // 'yoga' or 'prayers'

  return (
    <div className="wellness-container">
      <h2>Wellness Library</h2>
      <div className="wellness-tabs">
        <button
          className={activeTab === 'yoga' ? 'active' : ''}
          onClick={() => setActiveTab('yoga')}
        >
          🧘 Yoga Poses
        </button>
        <button
          className={activeTab === 'prayers' ? 'active' : ''}
          onClick={() => setActiveTab('prayers')}
        >
          🙏 Prayers
        </button>
      </div>

      <div className="wellness-content">
        {activeTab === 'yoga' && (
          <div className="yoga-list">
            {yogaPoses.map((pose) => (
              <div key={pose.id} className="yoga-card">
                <img src={pose.imageUrl} alt={pose.name} />
                <h3>{pose.name}</h3>
                <p>{pose.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className="prayers-list">
            {prayers.map((prayer) => (
              <div key={prayer.id} className="prayer-card">
                <h3>{prayer.title}</h3>
                <p className="prayer-text"><em>"{prayer.text}"</em></p>
                <p>{prayer.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessLibrary;