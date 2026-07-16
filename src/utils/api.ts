import type { WeatherData } from '../types/weather.types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error("Missing API Key in .env file");
}

const API_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
  
  if (!response.ok) {
    if (response.status === 404) throw new Error("City not found");
    if (response.status === 401) throw new Error("Invalid API Key");
    throw new Error("Failed to fetch data");
  }

  return response.json();
};