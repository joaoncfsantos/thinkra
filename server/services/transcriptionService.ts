import fs from "fs";
import { toFile } from "openai";
import openAiClient from "../utils/openai";
import { extractGapsAndGains } from "./dailyEntryService";

export async function transcribeAudio(file: Express.Multer.File) {
  try {
    const transcription = await openAiClient.audio.transcriptions.create({
      file: await toFile(fs.createReadStream(file.path), "audio.webm"),
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
