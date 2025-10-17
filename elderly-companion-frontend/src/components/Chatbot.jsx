// frontend/src/components/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  // State variables
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Load chat history on mount ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/history');
        if (res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([{ sender: 'bot', text: 'Hello! How are you feeling today?' }]);
        }
      } catch (err) {
        console.error('Could not fetch chat history', err);
        setMessages([{ sender: 'bot', text: 'Hello! How are you feeling today?' }]);
      }
    };

    fetchHistory();
  }, []);

  // --- Function to make the bot speak ---
  const speak = (text) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN'; // Indian English accent
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  // --- Send message handler ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: messageToSend });
      const botMessage = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);

      // Make the bot speak the reply
      speak(res.data.reply);
    } catch (err) {
      console.error('Error fetching bot reply:', err);
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
