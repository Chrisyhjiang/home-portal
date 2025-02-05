import React, { useState, useEffect } from 'react';

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<{ temp: number; icon: string; city: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherByLocation = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=59af8c71ad2dea30ab94fdb72a98ddab`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.main && data.weather && data.name) {
          setWeather({
            temp: Math.round(data.main.temp),
            icon: data.weather[0].icon,
            city: data.name
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

    const getLocation = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    };

    getLocation();
    const interval = setInterval(getLocation, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{weather.city}</span>
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