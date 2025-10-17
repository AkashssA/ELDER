// src/components/CommunityEvents.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommunityEvents.css';

const CommunityEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/community-events');
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch community events', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (isLoading) {
    return <div className="events-container"><p>Loading upcoming events...</p></div>;
  }

  return (
    <div className="events-container">
      <h2>Upcoming Community Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events scheduled. Please check back later!</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className={`event-type ${event.eventType.toLowerCase()}`}>{event.eventType}</div>
              <h3>{event.title}</h3>
              <p className="event-date">{formatDate(event.eventDate)}</p>
              <p>{event.description}</p>
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
                Join Event
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityEvents;