import express from "express";
import {
  createDailyEntry,
  deleteDailyEntry,
  getDailyEntries,
} from "../repositories/dailyEntryRepository";

const router = express.Router();

router.get("/daily-entry", async (req, res) => {
  try {
    const entries = await getDailyEntries();

    if (!Array.isArray(entries)) {
      console.log("Entries is not an array, returning 500");
      return res.status(500).json(entries);
    }

    res.json(entries);
  } catch (err: any) {
    console.error("Get entries error:", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

router.post("/daily-entry", async (req, res) => {
  try {
    const { date, goals, gains } = req.body;
    const entry = await createDailyEntry(date, goals, gains);
    res.json(entry);
  } catch (err: any) {
    console.error("Create entry error:", err.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

router.delete("/daily-entry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await deleteDailyEntry(id);
    res.json(entry);
  } catch (err: any) {
    console.error("Delete entry error:", err.message);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});
export default router;
