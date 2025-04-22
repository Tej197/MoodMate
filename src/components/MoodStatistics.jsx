import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodStatistics = ({ entries }) => {
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  // Get mood counts for the selected time range
  const getMoodData = () => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - (timeRange === 'week' ? 7 : 30));

    const filteredEntries = entries.filter(entry => 
      new Date(entry.date) >= startDate
    );

    // Group entries by date
    const groupedByDate = filteredEntries.reduce((groups, entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});

    // Calculate average mood for each date
    const moodValues = {
      'happy': 5,
      'energetic': 4,
      'relaxed': 3,
      'neutral': 2,
      'sad': 1,
      'angry': 0
    };

    const dates = Object.keys(groupedByDate).sort();
    const moodAverages = dates.map(date => {
      const dayEntries = groupedByDate[date];
      const average = dayEntries.reduce((sum, entry) => 
        sum + (moodValues[entry.mood] || 0), 0) / dayEntries.length;
      return average;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Mood Trend',
          data: moodAverages,
          borderColor: 'rgb(255, 148, 114)',
          backgroundColor: 'rgba(255, 148, 114, 0.5)',
          tension: 0.4
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Mood Trend - Last ${timeRange === 'week' ? '7 Days' : '30 Days'}`
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          callback: (value) => {
            const moodLabels = {
              0: 'Angry',
              1: 'Sad',
              2: 'Neutral',
              3: 'Relaxed',
              4: 'Energetic',
              5: 'Happy'
            };
            return moodLabels[value];
          }
        }
      }
    }
  };

  return (
    <div className="mood-statistics p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mood Trends</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded ${
              timeRange === 'week'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${
              timeRange === 'month'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="h-64">
          <Line data={getMoodData()} options={options} />
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No entries yet. Start by adding your mood!
        </p>
      )}
    </div>
  );
};

export default MoodStatistics;