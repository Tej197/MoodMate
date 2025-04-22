import React from 'react';

const Header = ({ darkMode, toggleDarkMode, currentWeather }) => {
  const getWeatherIcon = (iconCode) => {
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
  };

  return (
    <header className="py-4 mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold">MoodMate</h1>
      <div className="flex items-center gap-4">
        {currentWeather && (
          <div className="weather-display flex items-center gap-2">
            {getWeatherIcon(currentWeather.weather[0].icon)}
            <span>{Math.round(currentWeather.main.temp)}°C</span>
          </div>
        )}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;