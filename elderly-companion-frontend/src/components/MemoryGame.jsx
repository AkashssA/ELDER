// src/components/MemoryGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import './MemoryGame.css';

const BASE_EMOJIS = ['👵', '❤️', '🙏', '🌞', '🌸', '🪔'];
const WORDS = ['gratitude', 'lotus', 'family', 'balance', 'smile', 'garden', 'sunrise', 'music', 'calm', 'joyful'];

const createShuffledDeck = () => [...BASE_EMOJIS, ...BASE_EMOJIS].sort(() => Math.random() - 0.5);

const scrambleWord = (word) => {
  const letters = word.split('');
  let scrambled = word;
  while (scrambled === word) {
    scrambled = letters.sort(() => Math.random() - 0.5).join('');
  }
  return scrambled;
};

const MemoryGame = () => {
  const [activeGame, setActiveGame] = useState('memory');

  // Memory Match state
  const [deck, setDeck] = useState(() => createShuffledDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  // Word scramble state
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [wordScore, setWordScore] = useState(0);
  const [wordFeedback, setWordFeedback] = useState('');

  // Reaction challenge state
  const [reactionState, setReactionState] = useState('idle');
  const [reactionMessage, setReactionMessage] = useState('Tap start and wait for the pad to turn green.');
  const [reactionTime, setReactionTime] = useState(null);
  const [bestReactionTime, setBestReactionTime] = useState(null);
  const reactionTimeout = useRef(null);
  const reactionStart = useRef(null);

  useEffect(() => {
    if (flipped.length === 2) {
      const timeout = setTimeout(checkMatch, 700);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [flipped]);

  useEffect(() => {
    prepareWordChallenge();
    return () => {
      if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
    };
  }, []);

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;
    setFlipped((prev) => [...prev, index]);
  };

  const checkMatch = () => {
    if (flipped.length < 2) return;
    const [first, second] = flipped;
    setMoves((prev) => prev + 1);
    if (deck[first] === deck[second]) {
      setMatched((prev) => [...prev, first, second]);
    }
    setFlipped([]);
  };

  const resetMemoryGame = () => {
    setDeck(createShuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const prepareWordChallenge = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setWordInput('');
    setWordFeedback('');
  };

  const handleWordSubmit = (event) => {
    event.preventDefault();
    if (!wordInput) return;
    if (wordInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      setWordFeedback('Lovely! You unscrambled it.');
      setWordScore((prev) => prev + 1);
      prepareWordChallenge();
    } else {
      setWordFeedback('Almost! Try once more.');
    }
    setWordInput('');
  };

  const startReactionChallenge = () => {
    setReactionState('waiting');
    setReactionMessage('Get ready…');
    setReactionTime(null);
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
    reactionTimeout.current = setTimeout(() => {
      setReactionState('go');
      setReactionMessage('Tap now!');
      reactionStart.current = performance.now();
    }, 1500 + Math.random() * 2000);
  };

  const handleReactionPadClick = () => {
    if (reactionState === 'waiting') {
      setReactionState('idle');
      setReactionMessage('Too soon! Tap start again and wait for green.');
      if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
      return;
    }

    if (reactionState === 'go' && reactionStart.current) {
      const elapsed = Math.round(performance.now() - reactionStart.current);
      setReactionTime(elapsed);
      setReactionState('result');
      setReactionMessage(`Great job! ${elapsed} ms`);
      setBestReactionTime((prev) => (prev ? Math.min(prev, elapsed) : elapsed));
      return;
    }

    if (reactionState === 'result') {
      startReactionChallenge();
    }
  };

  const resetReactionChallenge = () => {
    setReactionState('idle');
    setReactionMessage('Tap start and wait for the pad to turn green.');
    setReactionTime(null);
    if (reactionTimeout.current) clearTimeout(reactionTimeout.current);
  };

  const isFlipped = (index) => flipped.includes(index) || matched.includes(index);
  const memoryComplete = matched.length === deck.length;

  const gameTabs = [
    { id: 'memory', label: 'Memory Match', description: 'Pair the icons to boost recollection.' },
    { id: 'word', label: 'Word Scramble', description: 'Unscramble cozy words for language agility.' },
    { id: 'reaction', label: 'Calm Reaction', description: 'Test reflexes with a gentle light tap.' },
  ];

  return (
    <div className="games-hub">
      <div className="games-header">
        <h2>Brain Boost Arcade</h2>
        <p>Mix memory, language, and reflex challenges to keep your mind joyful and active.</p>
      </div>

      <div className="games-tabs">
        {gameTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`games-tab ${activeGame === tab.id ? 'active' : ''}`}
            onClick={() => setActiveGame(tab.id)}
          >
            <span className="label">{tab.label}</span>
            <span className="description">{tab.description}</span>
          </button>
        ))}
      </div>

      <div className="game-panels">
        {activeGame === 'memory' && (
          <section className="game-panel">
            <div className="panel-header">
              <h3>Memory Match</h3>
              <p>Flip two cards at a time and remember their positions.</p>
            </div>
            <div className="game-board">
              {deck.map((card, index) => (
                <button
                  key={`${card}-${index}`}
                  type="button"
                  className={`card ${isFlipped(index) ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                  aria-label="Memory card"
                >
                  <div className="card-content">{isFlipped(index) ? card : '?'}</div>
                </button>
              ))}
            </div>
            <div className="game-info">
              <p>Moves: {moves}</p>
              {memoryComplete && <p className="win-message">All pairs found—brilliant memory!</p>}
              <button type="button" onClick={resetMemoryGame}>
                Reset Memory Game
              </button>
            </div>
          </section>
        )}

        {activeGame === 'word' && (
          <section className="game-panel">
            <div className="panel-header">
              <h3>Word Scramble</h3>
              <p>Rebuild the cozy word below. Each correct answer adds to your streak.</p>
            </div>
            <div className="word-challenge">
              <div className="scrambled-word">{scrambledWord}</div>
              <form onSubmit={handleWordSubmit}>
                <label htmlFor="word-guess" className="sr-only">Your guess</label>
                <input
                  id="word-guess"
                  type="text"
                  placeholder="Type the original word"
                  value={wordInput}
                  onChange={(event) => setWordInput(event.target.value)}
                  autoComplete="off"
                />
                <button type="submit">Check word</button>
              </form>
              <p className="word-feedback">{wordFeedback}</p>
              <div className="word-score">
                <span>Correct words: {wordScore}</span>
                <button type="button" onClick={prepareWordChallenge}>New scramble</button>
              </div>
            </div>
          </section>
        )}

        {activeGame === 'reaction' && (
          <section className="game-panel">
            <div className="panel-header">
              <h3>Calm Reaction</h3>
              <p>Breathe in, focus, and tap when the pad glows green.</p>
            </div>
            <div className="reaction-area">
              <button
                type="button"
                className={`reaction-pad ${reactionState}`}
                onClick={handleReactionPadClick}
                disabled={reactionState === 'idle'}
              >
                {reactionState === 'go' ? 'Tap!' : reactionState === 'waiting' ? 'Wait…' : 'Tap to record'}
              </button>
              <p className="reaction-message">{reactionMessage}</p>
              <div className="reaction-stats">
                <div>
                  <span>Last time</span>
                  <strong>{reactionTime ? `${reactionTime} ms` : '—'}</strong>
                </div>
                <div>
                  <span>Best time</span>
                  <strong>{bestReactionTime ? `${bestReactionTime} ms` : '—'}</strong>
                </div>
              </div>
              <div className="reaction-controls">
                <button type="button" onClick={startReactionChallenge}>
                  {reactionState === 'idle' ? 'Start test' : 'Restart'}
                </button>
                <button type="button" onClick={resetReactionChallenge} className="ghost">
                  Reset stats
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;