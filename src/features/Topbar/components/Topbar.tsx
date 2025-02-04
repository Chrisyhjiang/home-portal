import { useEffect, useState } from "react";
import WeatherDisplay from "./WeatherDisplay";

export default function Topbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-10 bg-gray-900/80 text-white flex items-center justify-between px-4 z-50 shadow-md">
      <div className="flex items-center gap-4">
        <span className="text-lg"></span>
        <span className="text-sm">Finder</span>
      </div>
      <div className="flex items-center gap-4">
        <WeatherDisplay />
        <div className="text-sm">
          {time.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit",
            second: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
}
