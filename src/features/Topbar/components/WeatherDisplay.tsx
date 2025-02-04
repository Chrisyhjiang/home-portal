import React, { useState, useEffect } from 'react';

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=YourCity&units=metric&appid=59af8c71ad2dea30ab94fdb72a98ddab`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.main && data.weather) {
          setWeather({
            temp: Math.round(data.main.temp),
            icon: data.weather[0].icon
          });
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather) return null;

  return (
    <div className="flex items-center gap-2">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt="Weather icon"
        className="w-5 h-5"
      />
      <span>{weather.temp}°C</span>
    </div>
  );
};

export default WeatherDisplay;