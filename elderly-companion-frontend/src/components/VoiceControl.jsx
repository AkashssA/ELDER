// src/components/VoiceControl.jsx
import React, { useState, useEffect, useRef } from 'react';
import './VoiceControl.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-IN';
}

const BUTTON_SIZE = 80;

const VoiceControl = ({ onNavigate, variant = 'full' }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [floatingLeft, setFloatingLeft] = useState(null);
    const [floatingBottom, setFloatingBottom] = useState(64);
    const [isDragging, setIsDragging] = useState(false);
    const dragState = useRef({ startX: 0, startY: 0, originLeft: 0, originBottom: 0 });
    const initialPositionSet = useRef(false);

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

    const handlePointerDown = (event) => {
        if (variant !== 'floating') return;
        event.preventDefault();
        dragState.current = {
            startX: event.clientX,
            startY: event.clientY,
            originLeft: floatingLeft ?? (window.innerWidth - BUTTON_SIZE) / 2,
            originBottom: floatingBottom ?? 64,
        };
        setIsDragging(true);
    };

    useEffect(() => {
        if (variant !== 'floating' || initialPositionSet.current) return undefined;
        if (typeof window === 'undefined') return undefined;
        const centerLeft = (window.innerWidth - BUTTON_SIZE) / 2;
        setFloatingLeft(centerLeft);
        setFloatingBottom(64);
        initialPositionSet.current = true;
        return undefined;
    }, [variant]);

    useEffect(() => {
        if (!isDragging) return undefined;
        const handleMove = (event) => {
            const deltaX = event.clientX - dragState.current.startX;
            const deltaY = dragState.current.startY - event.clientY;
            if (typeof window === 'undefined') return;
            const minLeft = 8;
            const maxLeft = window.innerWidth - BUTTON_SIZE - 8;
            const newLeft = Math.min(maxLeft, Math.max(minLeft, dragState.current.originLeft + deltaX));
            const minBottom = 24;
            const maxBottom = window.innerHeight - BUTTON_SIZE - 24;
            const newBottom = Math.min(maxBottom, Math.max(minBottom, dragState.current.originBottom + deltaY));
            setFloatingLeft(newLeft);
            setFloatingBottom(newBottom);
        };
        const handleUp = () => {
            setIsDragging(false);
        };
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [isDragging]);

    return (
    <div
      className={`voice-control-container ${variant}`}
      style={
        variant === 'floating'
          ? {
              left: floatingLeft !== null ? `${floatingLeft}px` : '50%',
              bottom: floatingBottom !== null ? `${floatingBottom}px` : '3.5rem',
            }
          : undefined
      }
    >
      <button
        onClick={handleListen}
        className={`mic-button ${isListening ? 'listening' : ''} ${variant}`}
        onPointerDown={handlePointerDown}
        type="button"
      >
        🎤
      </button>
      {variant === 'full' && (
        <p className="voice-feedback">{feedback || "Tap the mic and say a command like 'Show Health Monitor'"}</p>
      )}
      {variant === 'floating' && (
        <span className="floating-label">{isListening ? 'Listening...' : 'Voice commands'}</span>
      )}
    </div>
    );
};

export default VoiceControl;