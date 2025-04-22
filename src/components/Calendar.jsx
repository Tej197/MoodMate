import React, { useState, useEffect } from 'react';
import { getEntries } from '../utils/storage';

const Calendar = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState([]);
  
  useEffect(() => {
    setEntries(getEntries());
  }, []);
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString();
      const entry = entries.find(e => 
        new Date(e.date).toDateString() === new Date(date).toDateString()
      );
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${entry ? `mood-${entry.mood}` : ''}`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long' })}</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      <div className="calendar-weekdays">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;