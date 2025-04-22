import React from 'react';

const AllNotes = ({ entries, onBack }) => {
  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getMoodEmoji = (mood) => {
    const emojiMap = {
      'happy': '😊',
      'neutral': '😐',
      'sad': '😔',
      'angry': '😡',
      'sick': '🤢'
    };
    return emojiMap[mood] || '😐';
  };
  
  const getWeatherIcon = (weather) => {
    if (!weather) return null;
    
    // Weather icon mapping
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    
    return (
      <div className="note-weather">
        {weather.icon && iconMap[weather.icon]}
        {weather.temp && <span>{Math.round(weather.temp)}°C</span>}
      </div>
    );
  };
  
  return (
    <div className="all-notes-container">
      <div className="notes-header">
        <h2>All Notes</h2>
        <button onClick={onBack} className="back-button">Back</button>
      </div>
      
      <div className="notes-grid">
        {sortedEntries.length === 0 ? (
          <p className="no-entries">No entries yet. Start by adding your mood!</p>
        ) : (
          sortedEntries.map((entry, index) => (
            <div className="note-card" key={index}>
              <div className="note-mood">
                {getMoodEmoji(entry.mood)}
              </div>
              <div className="note-content">
                {entry.note}
              </div>
              <div className="note-footer">
                <div className="note-date">{formatDate(entry.date)}</div>
                {entry.weather && getWeatherIcon(entry.weather)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllNotes;