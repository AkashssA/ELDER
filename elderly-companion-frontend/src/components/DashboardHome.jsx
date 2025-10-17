// src/components/DashboardHome.jsx
import React from 'react';
import SOSButton from './SOSButton';
import VoiceControl from './VoiceControl'; // Import the Voice Assistant
import './DashboardHome.css'; // Import the new CSS

// A list of items to display as visual cards
const quickLinks = [
  {
    id: 'health',
    title: 'Health Monitor',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE0fHxkb2N0b3J8ZW58MHx8fHwxNjE2MTk0ODU5&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 'diet',
    title: 'Diet Tracker',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGhlYWx0aHklMjBmb29kfGVufDB8fHx8MTYxNjE5NDg5Mw&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 'scheduler',
    title: 'My Schedule',
    image: 'https://images.unsplash.com/photo-1519397902122-c9523668de2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxjYWxlbmRhcnxlbnwwfHx8fDE2MTYxOTQ5MjU&ixlib=rb-1.2.1&q=80&w=400',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1518975343515-88514b8f07c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE3fHxtb3ZpZSUyMHNlYXRzfGVufDB8fHx8MTYxNjE5NDk2NA&ixlib=rb-1.2.1&q=80&w=400',
  },
];

// This component now needs props to navigate and handle voice commands
const DashboardHome = ({ setActiveView, onNavigate }) => {
  return (
    <div>
      <SOSButton />
      <VoiceControl onNavigate={onNavigate} />

      <div className="home-grid">
        {quickLinks.map(link => (
          <div
            key={link.id}
            className="home-card"
            style={{ backgroundImage: `url(${link.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => setActiveView(link.id)}
          >
            <div className="home-card-content">
              <h3>{link.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;