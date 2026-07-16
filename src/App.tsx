import { useState, useEffect } from 'react';
import { fetchWeather } from './utils/api';
import type { WeatherData } from './types/weather.types';

function App() {
  const [city, setCity] = useState<string>(() => localStorage.getItem('lastCity') || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');

  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#0f172a' : '#f0f9ff';
    document.body.style.color = isDark ? '#e2e8f0' : '#1e293b';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Load saved city on mount
  useEffect(() => {
    if (city) handleSearch(city);
  }, []); 

  const handleSearch = async (searchCity: string) => {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const data = await fetchWeather(searchCity);
      setWeather(data);
      setCity(searchCity);
      localStorage.setItem('lastCity', searchCity);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          if (!response.ok) {
            if (response.status === 401) throw new Error("Invalid API Key");
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();
          setWeather(data);
          setCity(data.name); 
          localStorage.setItem('lastCity', data.name);
        } catch (err: any) {
          setError(err.message || "Failed to get location weather.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        let message = "Unable to retrieve location.";
        if (err.code === 1) message = "Location permission denied.";
        else if (err.code === 2) message = "Location unavailable.";
        else if (err.code === 3) message = "Location request timed out.";
        setError(message);
      }
    );
  };

  const toggleTheme = () => setIsDark(!isDark);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(city);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-5 font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-sky-50 text-slate-800'}`}>
      
      {/* Card Container */}
      <div className={`w-full max-w-lg p-8 rounded-2xl shadow-2xl transition-all duration-300 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        
        {/* Header */}
        <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Atmos</h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time weather data</p>
        
        <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className={`flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
            }`}
            autoFocus
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {/* Action Buttons Row */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handleGeolocation}
            className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 text-sm font-medium ${
              isDark 
                ? 'border-slate-600 text-white hover:bg-slate-700' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Use my current location"
          >
            📍 My Location
          </button>

          <button 
            onClick={toggleTheme} 
            className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
              isDark 
                ? 'border-slate-600 text-white hover:bg-slate-700' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="mt-6 animate-fade-in">
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {weather.name}, {weather.sys.country}
            </h2>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
              className="w-24 h-24 block mx-auto" 
            />
            <h1 className={`text-5xl font-bold my-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {Math.round(weather.main.temp)}°C
            </h1>
            <p className={`text-lg capitalize ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {weather.weather[0].description}
            </p>
            
            <div className={`flex justify-around mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-sky-50'}`}>
              <div className="text-center">
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Humidity</div>
                <strong className={`text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{weather.main.humidity}%</strong>
              </div>
              <div className="text-center">
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Wind</div>
                <strong className={`text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{Math.round(weather.wind.speed)} km/h</strong>
              </div>
              <div className="text-center">
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Feels Like</div>
                <strong className={`text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{Math.round(weather.main.feels_like)}°</strong>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className={`mt-8 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Built with React, TypeScript & Tailwind
      </footer>
    </div>
  );
}

export default App;