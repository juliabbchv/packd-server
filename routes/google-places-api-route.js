import express from "express";
import { fetchCityImage } from "../controllers/GooglePlacesApi.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: "City name is required." });
  }

  try {
    const imageUrl = await fetchCityImage(cityName);

    if (imageUrl) {
      return res.json({ imageUrl });
    } else {
      return res.status(404).json({ error: "Image not found for this city." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error generating images." });
  }
});

export default router;
