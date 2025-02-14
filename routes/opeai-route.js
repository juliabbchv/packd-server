import express from "express";
import { generatePackingList } from "../controllers/API.js";
import { addTripDetails } from "../controllers/trips-controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const packingList = await generatePackingList(req.body);

    res.json({ packingList });
  } catch (error) {
    res.status(500).json({ error: "Server error generating packing list." });
  }
});

export default router;
