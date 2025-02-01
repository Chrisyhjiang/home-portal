import { useEffect, useState } from "react";
import Desktop from "./components/Desktop";

export default function App() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/wallpaper");
      if (!response.ok) throw new Error("Failed to fetch wallpaper");
      const data = await response.json();

      console.log("✅ Selected wallpaper:", data.path); // ✅ Debugging
      setBackgroundImage(data.path); // ✅ Set background
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  useEffect(() => {
    fetchBackgroundImage();
    const interval = setInterval(fetchBackgroundImage, 180000); // Refresh every 3 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* 🔥 Semi-transparent blur overlay for better contrast */}
      <div
        className="absolute inset-0 backdrop-blur-lg bg-black/30"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.7)", // Slight darkening
        }}
      ></div>

      {/* macOS Desktop UI */}
      <Desktop />
    </div>
  );
}
