import fs from "fs";
import { toFile } from "openai";
import openAiClient from "../utils/openai";
import { extractGapsAndGains } from "./dailyEntryService";

export async function transcribeAudio(file: Express.Multer.File) {
  const stats = fs.statSync(file.path);
  const fileSizeMB = stats.size / (1024 * 1024);

  // Add file size validation (OpenAI Whisper has a 25MB limit)
  if (fileSizeMB > 24) {
    throw new Error("File too large. Maximum size is 24MB.");
  }

  try {
    // Read file into buffer for more reliable upload
    const fileBuffer = fs.readFileSync(file.path);
    const transcription = await openAiClient.audio.transcriptions.create({
      file: await toFile(fileBuffer, file.originalname || "audio.webm"),
      model: "whisper-1",
      response_format: "text",
    });

    // Clean up temp file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err.message);
    });

    const text = transcription;
    const result = await extractGapsAndGains(text);

    return { text, result };
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}
