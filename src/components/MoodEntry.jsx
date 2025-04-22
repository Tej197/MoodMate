import React, { useState } from 'react';
import Calendar from './Calendar';

const MoodEntry = ({ onSaveEntry, onViewNotes }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const moods = [
    { id: 'happy', emoji: '😊' },
    { id: 'neutral', emoji: '😐' },
    { id: 'sad', emoji: '😔' },
    { id: 'angry', emoji: '😡' },
    { id: 'sick', emoji: '🤢' }
  ];
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleSave = () => {
    if (!selectedMood) return;
    
    onSaveEntry({
      mood: selectedMood,
      note: note.trim(),
    });
    
    // Reset form
    setSelectedMood(null);
    setNote('');
  };
  
  return (
    <div className="mood-entry-container">
      <div className="date-selector">
        <h2>{formatDate()}</h2>
        {showCalendar ? (
          <Calendar onClose={() => setShowCalendar(false)} />
        ) : (
          <button onClick={() => setShowCalendar(true)} className="month-button">
            {new Date().toLocaleDateString('en-US', { month: 'long' })}
            <span className="dropdown-icon">▼</span>
          </button>
        )}
      </div>
      
      <div className="mood-question">
        <h3>How are you feeling today?</h3>
        <div className="mood-options">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood.id)}
            >
              <span role="img" aria-label={mood.id}>
                {mood.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="note-input">
        <textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      
      <button 
        className="save-button"
        onClick={handleSave}
        disabled={!selectedMood}
      >
        Save
      </button>
      
      <button 
        className="view-notes-button"
        onClick={onViewNotes}
      >
        View All Notes
      </button>
    </div>
  );
};

export default MoodEntry;