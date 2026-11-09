import React, { useState } from 'react';
import Welcome from '@/components/Welcome';
import WeatherApp from '@/components/WeatherApp';
import WeatherPlanner from '@/components/WeatherPlanner';
import Forecast from '@/components/Forecast';

const Index: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen weather-gradient pb-16">
      {showWelcome && <Welcome onComplete={handleWelcomeComplete} />}
      <div className={`transition-opacity duration-500 ${showWelcome ? 'opacity-0' : 'opacity-100 fade-in'}`}>
        <WeatherApp />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-8 relative z-10">
          <Forecast />
          <WeatherPlanner />
        </main>
      </div>
    </div>
  );
};

export default Index;
