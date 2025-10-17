// src/components/VoiceControl.jsx
import React, { useState, useEffect } from 'react';
import './VoiceControl.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-IN';
}

const VoiceControl = ({ onNavigate }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState('');

    // --- NEW, IMPROVED processCommand function ---
    const processCommand = (command) => {
        const lowerCaseCommand = command.toLowerCase();
        setFeedback(`I heard: "${lowerCaseCommand}"`);

        // Check for keywords instead of exact phrases
        if (lowerCaseCommand.includes('health')) {
            onNavigate('health');
            setFeedback('Navigating to Health Monitor.');
        } else if (lowerCaseCommand.includes('diet') || lowerCaseCommand.includes('food') || lowerCaseCommand.includes('nutrition')) {
            onNavigate('diet');
            setFeedback('Navigating to Diet Tracker.');
        } else if (lowerCaseCommand.includes('schedule') || lowerCaseCommand.includes('calendar') || lowerCaseCommand.includes('task')) {
            onNavigate('scheduler');
            setFeedback('Navigating to your Schedule.');
        } else if (lowerCaseCommand.includes('yoga') || lowerCaseCommand.includes('wellness') || lowerCaseCommand.includes('prayer')) {
            onNavigate('wellness');
            setFeedback('Navigating to the Wellness Library.');
        } else {
            setFeedback(`Sorry, I didn't understand the command "${lowerCaseCommand}".`);
        }
    };

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            let errorMessage = 'Sorry, there was an error with speech recognition.';
            if (event.error === 'not-allowed') {
                errorMessage = 'Microphone access was denied. Please allow it in your browser settings.';
            } else if (event.error === 'no-speech') {
                errorMessage = 'I did not hear anything. Please try again.';
            }
            setFeedback(errorMessage);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }, []);

    const handleListen = () => {
        if (!recognition) {
            alert("Sorry, your browser doesn't support voice commands.");
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            setFeedback('Listening...');
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <div className="voice-control-container">
            <button onClick={handleListen} className={`mic-button ${isListening ? 'listening' : ''}`}>
                🎤
            </button>
            <p className="voice-feedback">{feedback || "Tap the mic and say a command like 'Show Health Monitor'"}</p>
        </div>
    );
};

export default VoiceControl;