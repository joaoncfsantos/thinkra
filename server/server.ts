import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import cors from "cors";

import OpenAI, { toFile } from "openai";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in server/.env");
  process.exit(1);
}

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

const openAIClient = new OpenAI();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const transcription = await openAIClient.audio.transcriptions.create({
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
    const completion = await openAIClient.chat.completions.create({
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
