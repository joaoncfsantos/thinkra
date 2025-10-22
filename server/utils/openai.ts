import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;

dotenv.config();

if (!openAiApiKey) {
  console.error("Missing OPENAI_API_KEY in server/.env");
  process.exit(1);
}

const openAiClient = new OpenAI({
  apiKey: openAiApiKey,
});

export default openAiClient;
