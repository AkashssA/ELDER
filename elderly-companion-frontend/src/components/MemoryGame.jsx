// src/components/MemoryGame.jsx
import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

// Simple emoji cards. You can add more pairs.
const CARDS = ['👵', '❤️', '🙏', '🌞', '🌸', '🪔', '👵', '❤️', '🙏', '🌞', '🌸', '🪔'].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }, [flipped]);

  const handleCardClick = (index) => {
    if (flipped.length === 1 && flipped[0] === index) return; // Prevent clicking the same card twice
    setFlipped((prev) => [...prev, index]);
    setMoves(moves + 1);
  };

  const checkMatch = () => {
    const [first, second] = flipped;
    if (CARDS[first] === CARDS[second]) {
      setMatched((prev) => [...prev, CARDS[first]]);
    }
    setFlipped([]);
  };

  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    // Re-shuffle cards
    CARDS.sort(() => Math.random() - 0.5);
  };

  const isFlipped = (index) => flipped.includes(index) || matched.includes(CARDS[index]);

  return (
    <div className="game-container">
      <h2>Memory Game</h2>
      <div className="game-board">
        {CARDS.map((card, index) => (
          <div
            key={index}
            className={`card ${isFlipped(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-content">{isFlipped(index) ? card : '?'}</div>
          </div>
        ))}
      </div>
      <div className="game-info">
        <p>Moves: {Math.floor(moves / 2)}</p>
        {matched.length === CARDS.length / 2 && <p className="win-message">You won!</p>}
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};
export default MemoryGame;