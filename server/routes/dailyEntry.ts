import express from "express";
import { getDailyEntries } from "../repositories/dailyEntryRepository";

const router = express.Router();

router.get("/daily-entry", async (req, res) => {
  try {
    const entries = await getDailyEntries();

    if (!Array.isArray(entries)) {
      console.log("Entries is not an array, returning 500");
      return res.status(500).json(entries);
    }

    console.log("Sending entries:", entries);
    res.json(entries);
  } catch (err: any) {
    console.error("Get entries error:", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

export default router;
