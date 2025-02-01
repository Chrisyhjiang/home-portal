import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // ✅ Corrected import for ES Modules

const app = express();
const PORT = 3001;

app.use(cors()); // ✅ Enable CORS
app.use(express.json());

const WALLHAVEN_API_KEY = "d5JbCQhgMSJ63psr7tP5NFXQxD9nZEDH";
const WALLHAVEN_API_URL = `https://wallhaven.cc/api/v1/search?categories=111&purity=100&sorting=random&apikey=${WALLHAVEN_API_KEY}`;

// 📌 Proxy endpoint for fetching wallpapers
app.get("/api/wallpaper", async (req, res) => {
  try {
    const response = await fetch(WALLHAVEN_API_URL);
    if (!response.ok) {
      throw new Error(`Wallhaven API Error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data); // ✅ Forward response to frontend
  } catch (error) {
    console.error("Error fetching wallpaper:", error);
    res.status(500).json({ error: "Failed to fetch wallpaper" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
