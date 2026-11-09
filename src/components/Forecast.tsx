import React, { useState, useRef } from 'react';
import {
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  Eye,
  Gauge,
  LayoutGrid,
  List,
} from 'lucide-react';

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  pop: number; // Probability of precipitation (%)
  humidity: number; // Humidity (%)
  feelsLike?: number;
  windSpeed?: string;
  uvIndex?: number;
}

export interface DailyForecast {
  day: string;
  date?: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainChance: number;
  humidity?: number;
  windSpeed?: string;
}

export interface AdditionalMetrics {
  humidity: number;
  windSpeed: string;
  uvIndex: number;
  feelsLike: number;
  visibility: string;
  pressure: string;
  sunrise?: string;
  sunset?: string;
}

export interface ForecastProps {
  hourly?: HourlyForecast[];
  daily?: DailyForecast[];
  metrics?: AdditionalMetrics;
}

const defaultHourly: HourlyForecast[] = [
  { time: '12:00 AM', temp: 19, condition: 'Clear Night', icon: '🌙', pop: 0, humidity: 74, feelsLike: 19, windSpeed: '8 km/h' },
  { time: '01:00 AM', temp: 18, condition: 'Clear Night', icon: '🌙', pop: 0, humidity: 76, feelsLike: 18, windSpeed: '7 km/h' },
  { time: '02:00 AM', temp: 18, condition: 'Clear Night', icon: '🌙', pop: 0, humidity: 78, feelsLike: 18, windSpeed: '7 km/h' },
  { time: '03:00 AM', temp: 17, condition: 'Clear Night', icon: '🌙', pop: 5, humidity: 80, feelsLike: 17, windSpeed: '6 km/h' },
  { time: '04:00 AM', temp: 17, condition: 'Partly Cloudy', icon: '☁️', pop: 5, humidity: 82, feelsLike: 17, windSpeed: '6 km/h' },
  { time: '05:00 AM', temp: 18, condition: 'Partly Cloudy', icon: '☁️', pop: 10, humidity: 80, feelsLike: 18, windSpeed: '7 km/h' },
  { time: '06:00 AM', temp: 19, condition: 'Sunrise', icon: '🌅', pop: 10, humidity: 76, feelsLike: 19, windSpeed: '8 km/h' },
  { time: '07:00 AM', temp: 21, condition: 'Sunny', icon: '☀️', pop: 5, humidity: 70, feelsLike: 21, windSpeed: '10 km/h' },
  { time: '08:00 AM', temp: 23, condition: 'Sunny', icon: '☀️', pop: 5, humidity: 64, feelsLike: 23, windSpeed: '11 km/h' },
  { time: '09:00 AM', temp: 25, condition: 'Mostly Sunny', icon: '🌤️', pop: 10, humidity: 58, feelsLike: 26, windSpeed: '12 km/h' },
  { time: '10:00 AM', temp: 27, condition: 'Sunny', icon: '☀️', pop: 10, humidity: 52, feelsLike: 28, windSpeed: '13 km/h' },
  { time: '11:00 AM', temp: 29, condition: 'Partly Cloudy', icon: '⛅', pop: 15, humidity: 48, feelsLike: 31, windSpeed: '14 km/h' },
  { time: '12:00 PM', temp: 30, condition: 'Partly Cloudy', icon: '⛅', pop: 20, humidity: 44, feelsLike: 32, windSpeed: '15 km/h' },
  { time: '01:00 PM', temp: 31, condition: 'Passing Clouds', icon: '⛅', pop: 25, humidity: 42, feelsLike: 33, windSpeed: '16 km/h' },
  { time: '02:00 PM', temp: 31, condition: 'Scattered Showers', icon: '🌦️', pop: 45, humidity: 50, feelsLike: 34, windSpeed: '18 km/h' },
  { time: '03:00 PM', temp: 29, condition: 'Light Rain', icon: '🌧️', pop: 60, humidity: 64, feelsLike: 31, windSpeed: '17 km/h' },
  { time: '04:00 PM', temp: 28, condition: 'Overcast', icon: '☁️', pop: 40, humidity: 60, feelsLike: 29, windSpeed: '15 km/h' },
  { time: '05:00 PM', temp: 27, condition: 'Clearing Up', icon: '🌤️', pop: 25, humidity: 56, feelsLike: 28, windSpeed: '14 km/h' },
  { time: '06:00 PM', temp: 25, condition: 'Sunset', icon: '🌇', pop: 15, humidity: 60, feelsLike: 26, windSpeed: '12 km/h' },
  { time: '07:00 PM', temp: 24, condition: 'Clear Evening', icon: '🌙', pop: 10, humidity: 64, feelsLike: 25, windSpeed: '10 km/h' },
  { time: '08:00 PM', temp: 23, condition: 'Clear', icon: '🌙', pop: 5, humidity: 67, feelsLike: 24, windSpeed: '9 km/h' },
  { time: '09:00 PM', temp: 22, condition: 'Clear', icon: '🌙', pop: 5, humidity: 69, feelsLike: 22, windSpeed: '8 km/h' },
  { time: '10:00 PM', temp: 21, condition: 'Clear', icon: '🌙', pop: 0, humidity: 71, feelsLike: 21, windSpeed: '8 km/h' },
  { time: '11:00 PM', temp: 20, condition: 'Clear', icon: '🌙', pop: 0, humidity: 73, feelsLike: 20, windSpeed: '7 km/h' },
];

const defaultDaily: DailyForecast[] = [
  { day: 'Today', date: 'Nov 9', tempMax: 31, tempMin: 18, condition: 'Scattered Showers', icon: '🌦️', rainChance: 45, humidity: 52, windSpeed: '18 km/h' },
  { day: 'Tue', date: 'Nov 10', tempMax: 28, tempMin: 17, condition: 'Partly Cloudy', icon: '⛅', rainChance: 20, humidity: 48, windSpeed: '14 km/h' },
  { day: 'Wed', date: 'Nov 11', tempMax: 26, tempMin: 16, condition: 'Light Rain', icon: '🌧️', rainChance: 65, humidity: 68, windSpeed: '17 km/h' },
  { day: 'Thu', date: 'Nov 12', tempMax: 27, tempMin: 17, condition: 'Overcast', icon: '☁️', rainChance: 25, humidity: 56, windSpeed: '12 km/h' },
  { day: 'Fri', date: 'Nov 13', tempMax: 29, tempMin: 19, condition: 'Sunny & Clear', icon: '☀️', rainChance: 10, humidity: 45, windSpeed: '10 km/h' },
];

const defaultMetrics: AdditionalMetrics = {
  humidity: 62,
  windSpeed: '14 km/h NW',
  uvIndex: 6,
  feelsLike: 31,
  visibility: '10 km',
  pressure: '1013 hPa',
};

export const Forecast: React.FC<ForecastProps> = ({
  hourly = defaultHourly,
  daily = defaultDaily,
  metrics = defaultMetrics,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);
  const [dailyViewMode, setDailyViewMode] = useState<'list' | 'grid'>('list');

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const selectedHour = selectedHourIndex !== null ? hourly[selectedHourIndex] : null;

  return (
    <section className="w-full max-w-7xl mx-auto space-y-6">
      {/* 24-Hour Interactive Horizontal Scrollable Slider */}
      <div className="p-5 sm:p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">24-Hour Forecast</h3>
                <span className="text-xs px-2 py-0.5 font-semibold bg-blue-100 text-blue-800 rounded-full">
                  24h Live Slider
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Smooth hourly precipitation, temperature & humidity progression
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {selectedHour && (
              <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg animate-fade-in hidden md:inline-block">
                Selected: {selectedHour.time} • {selectedHour.temp}°C • {selectedHour.condition}
              </span>
            )}
            <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all active:scale-95"
                aria-label="Scroll left"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('right')}
                className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all active:scale-95"
                aria-label="Scroll right"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container with custom styled Tailwind scrollbar */}
        <div
          ref={sliderRef}
          tabIndex={0}
          aria-label="24-hour weather forecast slider"
          className="overflow-x-auto flex gap-3 pb-3 pt-1 px-1 custom-scrollbar scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-xl"
        >
          {hourly.map((item, index) => {
            const isSelected = selectedHourIndex === index;
            return (
              <div
                key={`${item.time}-${index}`}
                onClick={() => setSelectedHourIndex(isSelected ? null : index)}
                className={`flex-none w-[114px] sm:w-[124px] p-3 rounded-xl border transition-all duration-200 select-none cursor-pointer flex flex-col items-center justify-between text-center group ${
                  isSelected
                    ? 'bg-blue-50/95 border-blue-400 shadow-md -translate-y-1 scale-[1.02] ring-2 ring-blue-300'
                    : 'bg-white/70 hover:bg-white border-white/60 hover:border-blue-200 shadow-xs hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Time */}
                <span className="text-xs font-semibold text-gray-700 tracking-tight">
                  {item.time}
                </span>

                {/* Weather Icon */}
                <span className="text-3xl my-2 transform group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>

                {/* Temperature in °C */}
                <span className="text-base font-bold text-gray-900">
                  {item.temp}°C
                </span>

                {/* Precipitation Percentage Badge */}
                <div className="mt-1.5 w-full flex justify-center">
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.pop >= 40
                        ? 'bg-blue-500 text-white shadow-xs'
                        : item.pop > 0
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    💧 {item.pop}%
                  </span>
                </div>

                {/* Humidity */}
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>{item.humidity}%</span>
                </div>

                {/* Condition hint */}
                <span className="mt-1 text-[10px] text-gray-400 truncate max-w-full font-medium">
                  {item.condition}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive Grid Layout: 5-Day Forecast & Additional Weather Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5-Day Weather Forecast Card */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    5-Day Weather Forecast
                  </h3>
                  <p className="text-xs text-gray-500">Extended daily outlook & rain trends</p>
                </div>
              </div>

              {/* View switch button */}
              <div className="flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDailyViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    dailyViewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDailyViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    dailyViewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {dailyViewMode === 'list' ? (
              <div className="space-y-2.5">
                {daily.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white border border-white/50 hover:border-blue-200 shadow-xs hover:shadow-sm transition-all group"
                  >
                    <div className="w-24 sm:w-28 text-left">
                      <span className="font-semibold text-sm text-gray-800 block">
                        {item.day}
                      </span>
                      {item.date && (
                        <span className="text-[11px] text-gray-400 font-medium">
                          {item.date}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                        {item.condition}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-blue-600 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-center mr-3">
                      💧 {item.rainChance}%
                    </div>

                    <div className="text-sm font-bold text-gray-900 w-24 sm:w-28 text-right">
                      <span>{item.tempMax}°</span>{' '}
                      <span className="text-gray-400 font-normal">/ {item.tempMin}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {daily.map((item) => (
                  <div
                    key={item.day}
                    className="p-3.5 rounded-xl bg-white/60 hover:bg-white border border-white/50 hover:border-blue-200 shadow-xs hover:shadow-sm transition-all flex flex-col items-center text-center group"
                  >
                    <span className="font-semibold text-xs text-gray-800">{item.day}</span>
                    {item.date && (
                      <span className="text-[10px] text-gray-400 mb-1">{item.date}</span>
                    )}
                    <span className="text-3xl my-2 transform group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium truncate max-w-full mb-2">
                      {item.condition}
                    </span>
                    <div className="mt-auto w-full pt-2 border-t border-gray-100 flex flex-col gap-1 items-center">
                      <span className="text-[10px] font-semibold text-blue-600 px-1.5 py-0.5 rounded-full bg-blue-50">
                        💧 {item.rainChance}%
                      </span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5">
                        {item.tempMax}° / <span className="text-gray-400 font-normal">{item.tempMin}°</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Weather Details Grid Card */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Additional Weather Details
                </h3>
                <p className="text-xs text-gray-500">Atmospheric indicators & comfort levels</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Feels Like
                  </span>
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.feelsLike}°C</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Similar to actual</p>
              </div>

              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Humidity
                  </span>
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.humidity}%</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Moderate moisture</p>
              </div>

              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Wind Speed
                  </span>
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">{metrics.windSpeed}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Gentle breeze</p>
              </div>

              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    UV Index
                  </span>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {metrics.uvIndex}{' '}
                  <span className="text-xs font-medium text-amber-600">(Moderate)</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Sun protection advised</p>
              </div>

              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Visibility
                  </span>
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-lg font-bold text-gray-900">{metrics.visibility}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Clear view</p>
              </div>

              <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-white/60 shadow-xs transition-all">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Pressure
                  </span>
                  <Gauge className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1">{metrics.pressure}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Normal barometric</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forecast;
