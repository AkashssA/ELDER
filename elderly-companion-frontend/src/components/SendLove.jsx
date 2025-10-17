// src/components/SendLove.jsx
import React, { useState } from 'react';
import axios from 'axios';

const SendLove = () => {
    const [feedback, setFeedback] = useState('');
    const handleSendLove = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/alerts/send-love');
            setFeedback(res.data.msg);
        } catch (err) {
            setFeedback('Could not send message.');
        }
        setTimeout(() => setFeedback(''), 4000);
    };
    return (
        <div style={{ textAlign: 'center', margin: '1rem' }}>
            <button onClick={handleSendLove} style={{ fontSize: '1.2rem', padding: '1rem', cursor: 'pointer' }}>
                ❤️ Send Love to Family
            </button>
            {feedback && <p>{feedback}</p>}
        </div>
    );
};
export default SendLove;