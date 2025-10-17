// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen, activeView, setActiveView }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'health', label: 'Health Monitor', icon: '❤️' },
    { id: 'diet', label: 'Diet Tracker', icon: '🥗' },
    { id: 'scheduler', label: 'Scheduler', icon: '🗓️' },
    { id: 'gallery', label: 'Photo Gallery', icon: '🖼️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'game', label: 'Memory Game', icon: '🧠' },
    { id: 'events', label: 'Community', icon: '🎉' },
  ];

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '«' : '»'}
        </button>
        <h3 style={{ display: isOpen ? 'block' : 'none' }}>Companion</h3>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`menu-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={item.label}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;