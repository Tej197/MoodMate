// File: src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import MoodEntry from './components/MoodEntry';
import AllNotes from './components/AllNotes';
import Header from './components/Header';
import MoodStatistics from './components/MoodStatistics';
import { saveEntry, getEntries } from './utils/storage';
import { fetchWeather } from './utils/weatherApi';
import { exportAsCSV, exportAsPDF } from './utils/exportUtils';

function App() {
  const [view, setView] = useState('entry'); // 'entry' or 'notes'
  const [currentWeather, setCurrentWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [entries, setEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Get geolocation and fetch weather
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Location obtained:', { latitude, longitude });
      setLocation({ latitude, longitude });
      setLocationError(null);
    };

    const error = (err) => {
      console.error('Geolocation error:', err);
      let errorMessage = 'Unable to retrieve your location';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Please allow location access to get weather information';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'An unknown error occurred';
      }
      
      setLocationError(errorMessage);
    };

    console.log('Requesting location...');
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  // Fetch weather when location is available
  useEffect(() => {
    if (location) {
      console.log('Fetching weather for location:', location);
      fetchWeather(location.latitude, location.longitude)
        .then((data) => {
          console.log('Weather data received:', data);
          setCurrentWeather(data);
        })
        .catch((error) => {
          console.error('Error fetching weather:', error);
        });
    }
  }, [location]);

  // Load entries from local storage
  useEffect(() => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
  }, []);

  const handleSaveEntry = (entry) => {
    const newEntry = {
      ...entry,
      date: new Date().toISOString(),
      weather: currentWeather ? {
        temp: currentWeather.main.temp,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon
      } : null
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    saveEntry(newEntry);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="app-content">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          currentWeather={currentWeather}
        />
        
        {locationError && (
          <div className="location-error p-4 mb-4 bg-red-100 text-red-700 rounded">
            {locationError}
          </div>
        )}
        
        <main>
          {view === 'entry' ? (
            <div className="space-y-6">
              <MoodEntry 
                onSaveEntry={handleSaveEntry} 
                onViewNotes={() => setView('notes')} 
              />
              <MoodStatistics entries={entries} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => exportAsCSV(entries)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportAsPDF(entries)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Export as PDF
                </button>
              </div>
              <AllNotes 
                entries={entries} 
                onBack={() => setView('entry')} 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Helper function to render weather icons
function getWeatherIcon(iconCode) {
  // For simplicity we'll use emoji, but you could use weather icons from a library
  const iconMap = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain
    '10n': '🌧️',
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '☀️';
}

export default App;