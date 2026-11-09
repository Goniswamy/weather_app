import React, { useState } from 'react';

interface ForecastHour {
  time: string;
  temp: number;
  condition: string;
  pop: number; // Probability of precipitation (0 - 100%)
  humidity: number;
}

interface ActivityRule {
  id: string;
  name: string;
  icon: string;
  idealWeather: string;
  evaluator: (hour: ForecastHour) => number; // Higher score = better time slot
}

interface WeatherPlannerProps {
  forecastData?: ForecastHour[];
}

// Fallback forecast mock data if real API props aren't passed yet
const defaultForecast: ForecastHour[] = [
  { time: '06:00 AM', temp: 21, condition: 'Clear', pop: 5, humidity: 65 },
  { time: '09:00 AM', temp: 24, condition: 'Sunny', pop: 10, humidity: 55 },
  { time: '12:00 PM', temp: 29, condition: 'Hot', pop: 15, humidity: 40 },
  { time: '03:00 PM', temp: 28, condition: 'Cloudy', pop: 20, humidity: 45 },
  { time: '06:00 PM', temp: 23, condition: 'Clear', pop: 5, humidity: 60 },
  { time: '09:00 PM', temp: 20, condition: 'Cool', pop: 0, humidity: 70 },
];

export const WeatherPlanner: React.FC<WeatherPlannerProps> = ({ forecastData = defaultForecast }) => {
  const activities: ActivityRule[] = [
    {
      id: 'running',
      name: 'Outdoor Running',
      icon: '🏃‍♂️',
      idealWeather: 'Cool (<25°C) & Low Rain',
      evaluator: (h) => (h.temp <= 25 ? 50 : 20) + (100 - h.pop) + (100 - h.humidity) / 2,
    },
    {
      id: 'laundry',
      name: 'Drying Laundry',
      icon: '🧺',
      idealWeather: 'Warm (>24°C) & Sunny',
      evaluator: (h) => (h.temp >= 24 ? 50 : 10) + (100 - h.pop * 2) - h.humidity,
    },
    {
      id: 'study',
      name: 'Outdoor Study',
      icon: '📚',
      idealWeather: 'Mild (20–26°C) & Clear',
      evaluator: (h) => (h.temp >= 20 && h.temp <= 26 ? 60 : 15) + (100 - h.pop),
    },
    {
      id: 'travel',
      name: 'Short Travel / Drive',
      icon: '🚗',
      idealWeather: 'Dry & Moderate Temp',
      evaluator: (h) => (h.pop < 15 ? 70 : 10) + (30 - Math.abs(h.temp - 24)),
    },
  ];

  const [selected, setSelected] = useState<ActivityRule>(activities[0]);

  // Rank forecast hours based on selected activity evaluator rule
  const rankedHours = [...forecastData].sort((a, b) => selected.evaluator(b) - selected.evaluator(a));
  const bestSlot = rankedHours[0];

  return (
    <div className="p-5 my-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌤️</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Weather-Aware Daily Planner</h2>
            <p className="text-xs text-gray-500">Smart time slot recommendations based on forecast</p>
          </div>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
          Feature Branch
        </span>
      </div>

      {/* Activity Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {activities.map((act) => (
          <button
            key={act.id}
            onClick={() => setSelected(act)}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-semibold transition-all border ${
              selected.id === act.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>{act.icon}</span>
            <span className="truncate">{act.name}</span>
          </button>
        ))}
      </div>

      {/* Best Slot Highlight Card */}
      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
            Optimal Recommended Time
          </span>
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full">
            Target: {selected.idealWeather}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-1">
          <span className="text-2xl font-extrabold">{bestSlot.time}</span>
          <span className="text-sm font-medium text-blue-100">
            ({bestSlot.temp}°C — {bestSlot.condition})
          </span>
        </div>

        <p className="text-xs text-blue-100 mt-2">
          💧 Rain Chance: {bestSlot.pop}% | 💨 Humidity: {bestSlot.humidity}%
        </p>
      </div>

      {/* Forecast Preview Timeline */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Hourly Forecast Evaluation
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {forecastData.map((item) => (
            <div
              key={item.time}
              className={`p-2 text-center rounded-lg border text-xs ${
                item.time === bestSlot.time
                  ? 'border-blue-500 bg-blue-50 font-bold text-blue-700'
                  : 'border-gray-100 bg-gray-50 text-gray-600'
              }`}
            >
              <p className="text-[10px] text-gray-400">{item.time}</p>
              <p className="my-0.5">{item.temp}°C</p>
              <p className="text-[10px] text-blue-500">{item.pop}% rain</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherPlanner;