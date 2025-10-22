import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import { toFile } from "openai";
import supabase from "./utils/supabase";
import openAiClient from "./utils/openai";

const app = express();
const port = 3000;

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "audio/webm",
      "audio/wav",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const transcription = await openAiClient.audio.transcriptions.create({
      file: await toFile(fs.createReadStream(req.file.path), "audio.webm"),
      model: "whisper-1",
      response_format: "text",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err.message);
    });

    const text = transcription;
    const result = await extractGapsAndGains(text);

    res.json({ text, result });
  } catch (err: any) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function extractGapsAndGains(input: string) {
  try {
    const completion = await openAiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts goals and gains from journal entries. Extract 3 goals for the next day and 3 gains from the current day, as succint as possible. Format as JSON with 'goals' and 'gains' arrays.",
        },
        {
          role: "user",
          content: `Extract the three goals for the next day and three gains from today from this text: ${input}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error extracting gaps and gains:", error);
    return { goals: [], gains: [], error: "Failed to extract information" };
  }
}

app.get("/api/daily-entry", async (req, res) => {
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

async function saveDailyEntry(date: string, goals: string[], gains: string[]) {
  try {
    const { data, error } = await supabase.from("daily_entries").insert({
      date,
      goals,
      gains,
    });
  } catch (error) {
    console.error("Error saving daily entry:", error);
    return { error: "Failed to save daily entry" };
  }
}

async function getDailyEntries() {
  try {
    const { data, error } = await supabase
      .from("daily_entries")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Failed to get daily entries" };
    }

    return data;
  } catch (error) {
    console.error("Error getting daily entries:", error);
    return { error: "Failed to get daily entries" };
  }
}
