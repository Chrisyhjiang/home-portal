import { useEffect, useState } from "react";
import Desktop from "./components/Desktop";

export default function App() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const fetchBackgroundImage = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/wallpaper"); // ✅ Use backend
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Fetched wallpaper data:", data); // ✅ Debugging

      if (data.data && data.data.length > 0) {
        const randomWallpaper =
          data.data[Math.floor(Math.random() * data.data.length)]; // Pick a random one
        console.log("Selected wallpaper:", randomWallpaper.path); // ✅ Debugging

        setBackgroundImage(randomWallpaper.path);
      } else {
        console.warn("No wallpapers found in API response!");
      }
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
    <div
      style={{
        backgroundColor: "beige", // ✅ Default background
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Desktop />
    </div>
  );
}
