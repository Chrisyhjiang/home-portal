import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Ensure it's installed

const app = express();
const PORT = 3001;

app.use(cors()); // Allow frontend access
app.use(express.json());

const WALLHAVEN_API_KEY = "your_api_key_here"; // Replace with your actual API key
const WALLHAVEN_API_URL = `https://wallhaven.cc/api/v1/search?categories=111&purity=100&sorting=random&apikey=${WALLHAVEN_API_KEY}`;

const ALLOWED_TAGS = [
  "rain",
  "clouds",
  "mountains",
  "nature",
  "scenery",
  "forest",
  "sunset",
  "sky",
  "water",
  "landscape",
  "river",
  "beach",
  "lake",
  "flowers",
  "trees",
  "snow",
  "stars",
  "night",
  "ocean",
];

app.get("/api/wallpaper", async (req, res) => {
  try {
    console.log("🔄 Fetching wallpapers from Wallhaven...");

    const response = await fetch(WALLHAVEN_API_URL);
    if (!response.ok) {
      console.error("Wallhaven API error:", response.status);
      return res.status(response.status).json({ error: "Wallhaven API error" });
    }

    const data = await response.json();
    console.log("✅ Fetched wallpaper data:", data);

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from Wallhaven API.");
    }

    // Check if `wallpaper.tags` exists before filtering
    const filteredWallpapers = data.data.filter(
      (wallpaper) =>
        wallpaper.tags &&
        Array.isArray(wallpaper.tags) &&
        wallpaper.tags.some((tag) =>
          ALLOWED_TAGS.includes(tag.name.toLowerCase())
        )
    );

    if (filteredWallpapers.length === 0) {
      console.warn("⚠️ No wallpapers found, trying fallback...");
      const fallbackResponse = await fetch(
        `https://wallhaven.cc/api/v1/search?categories=100&purity=100&sorting=random&apikey=${WALLHAVEN_API_KEY}&q=nature`
      );
      const fallbackData = await fallbackResponse.json();

      if (!fallbackData.data || fallbackData.data.length === 0) {
        return res.status(404).json({ error: "No safe wallpapers available" });
      }

      const fallbackWallpaper =
        fallbackData.data[Math.floor(Math.random() * fallbackData.data.length)];
      return res.json(fallbackWallpaper);
    }

    const selectedWallpaper =
      filteredWallpapers[Math.floor(Math.random() * filteredWallpapers.length)];
    console.log("✅ Selected wallpaper:", selectedWallpaper.path);

    return res.json(selectedWallpaper);
  } catch (error) {
    console.error("❌ Error fetching wallpaper:", error.message);
    res.status(500).json({ error: "Failed to fetch wallpaper" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
