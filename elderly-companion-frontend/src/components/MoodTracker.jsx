import React, { useMemo, useState } from 'react';
import './MoodTracker.css';

const MOOD_OPTIONS = [
  { id: 'joyful', label: 'Joyful', icon: '😊', color: '#ffb347' },
  { id: 'calm', label: 'Calm', icon: '😌', color: '#6ec6ff' },
  { id: 'energetic', label: 'Energetic', icon: '💪', color: '#a8e063' },
  { id: 'tired', label: 'Tired', icon: '🥱', color: '#d3b8ae' },
  { id: 'anxious', label: 'Anxious', icon: '😟', color: '#ff8a80' },
  { id: 'lonely', label: 'Lonely', icon: '🙁', color: '#c3aed6' },
];

const getStoredEntries = () => {
  try {
    const stored = localStorage.getItem('moodEntries');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Unable to read mood entries', error);
    return [];
  }
};

const saveEntries = (entries) => {
  localStorage.setItem('moodEntries', JSON.stringify(entries));
};

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime();
};

const getStreak = (entries) => {
  if (!entries.length) return 0;
  const uniqueDays = Array.from(
    new Set(entries.map((entry) => normalizeDate(entry.date))),
  ).sort((a, b) => b - a);

  const today = normalizeDate(new Date());
  let streak = 0;

  for (let i = 0; i < uniqueDays.length; i += 1) {
    const expectedDay = today - i * 24 * 60 * 60 * 1000;
    if (uniqueDays[i] === expectedDay) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};

const MoodTracker = () => {
  const [entries, setEntries] = useState(() => getStoredEntries());
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const todaysEntry = useMemo(() => {
    const today = normalizeDate(new Date());
    return entries.find((entry) => normalizeDate(entry.date) === today);
  }, [entries]);

  const streak = useMemo(() => getStreak(entries), [entries]);

  const latestEntries = useMemo(
    () =>
      [...entries]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [entries],
  );

  const activeMood = useMemo(
    () => MOOD_OPTIONS.find((option) => option.id === (todaysEntry?.mood || selectedMood)),
    [todaysEntry, selectedMood],
  );

  const insights = useMemo(() => {
    if (!activeMood) {
      return 'Check in with a mood to unlock a personalized care tip.';
    }
    switch (activeMood.id) {
      case 'joyful':
        return 'Share your joy with a loved one or record a gratitude note.';
      case 'calm':
        return 'A gentle stretch or hydration reminder keeps the calm going.';
      case 'energetic':
        return 'Channel that energy into a light walk or dance session.';
      case 'tired':
        return 'Schedule a rest, hydrate, and let your care circle know you need an easy day.';
      case 'anxious':
        return 'Try 4-7-8 breathing and tap the Request Help card if you need company.';
      case 'lonely':
        return 'Reach out to your care circle or jump into Community Events for connection.';
      default:
        return 'Your wellbeing matters. Keep listening to what your body needs.';
    }
  }, [activeMood]);

  const handleSelectMood = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const moodToSave = selectedMood || todaysEntry?.mood;
    if (!moodToSave) return;

    const entry = {
      id: Date.now(),
      mood: moodToSave,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    const updatedEntries = [...entries.filter((item) => normalizeDate(item.date) !== normalizeDate(entry.date)), entry];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
    setNote('');
    setSelectedMood(null);
  };

  return (
    <div className="mood-tracker">
      <section className="mood-hero">
        <div>
          <p className="eyebrow">Daily emotional care</p>
          <h3>How are you feeling today?</h3>
          <p>Logging your mood helps caregivers personalize support and spot changes early.</p>
        </div>
        <div className="streak-card">
          <div className="streak-number">{streak}</div>
          <p>day streak</p>
          <span>Consistent check-ins build healthier habits.</span>
        </div>
      </section>

      <section className="mood-options">
        {MOOD_OPTIONS.map((option) => {
          const isActive = activeMood?.id === option.id || selectedMood === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`mood-option ${isActive ? 'active' : ''}`}
              style={{ backgroundColor: isActive ? option.color : undefined }}
              onClick={() => handleSelectMood(option.id)}
              aria-pressed={isActive}
            >
              <span className="icon">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </section>

      <section className="mood-journal">
        <div className="insights-card">
          <h4>Care tip</h4>
          <p>{insights}</p>
        </div>
        <form className="journal-card" onSubmit={handleSubmit}>
          <label htmlFor="mood-note">Add a short note (optional)</label>
          <textarea
            id="mood-note"
            placeholder="E.g. Enjoyed a walk, spoke with my daughter, feeling a bit tired..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <button type="submit" className="journal-submit" disabled={!selectedMood && !todaysEntry}>
            {todaysEntry ? 'Update today’s mood' : 'Save today’s mood'}
          </button>
        </form>
      </section>

      <section className="mood-history">
        <div className="history-header">
          <h4>Recent reflections</h4>
          <p>Share the last five updates with your care circle automatically.</p>
        </div>
        <div className="history-list">
          {latestEntries.length ? (
            latestEntries.map((entry) => {
              const option = MOOD_OPTIONS.find((item) => item.id === entry.mood);
              const formattedDate = new Date(entry.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              return (
                <article key={entry.id} className="history-item">
                  <span className="history-icon" style={{ backgroundColor: option?.color || '#ccc' }}>
                    {option?.icon}
                  </span>
                  <div>
                    <p className="history-title">{option?.label || 'Mood'}</p>
                    <p className="history-date">{formattedDate}</p>
                    {entry.note && <p className="history-note">{entry.note}</p>}
                  </div>
                </article>
              );
            })
          ) : (
            <p className="empty-state">Your history will appear here once you complete a check-in.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoodTracker;


