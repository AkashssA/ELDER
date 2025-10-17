// frontend/src/components/Scheduler.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Scheduler.css';

const localizer = momentLocalizer(moment);

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      // Important: Convert date strings from DB back into Date objects
      const formattedEvents = res.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/events', { title, start, end });
      fetchEvents(); // Refresh events from the server
      setTitle('');
      setStart('');
      setEnd('');
    } catch (err) {
      console.error('Failed to add event', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if(window.confirm("Are you sure you want to delete this event?")){
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            fetchEvents(); // Refresh the list
        } catch (err) {
            console.error("Failed to delete event", err);
        }
    }
  }

  return (
    <div className="scheduler-container">
      <h2>Your Day Scheduler</h2>
      <div className="add-event-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleAddEvent}>
          <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} />
          <div>
            <label>Start Time:</label>
            <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label>End Time:</label>
            <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={event => handleDeleteEvent(event._id)} // Click event to delete
        />
      </div>
      <p className="calendar-tip">Click on a task in the calendar to delete it.</p>
    </div>
  );
};

export default Scheduler;