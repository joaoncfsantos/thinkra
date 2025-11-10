import express from "express";
import { authenticateUser, AuthenticatedRequest } from "../middleware/auth";
import { transcribeAudio } from "../services/transcriptionService";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use(authenticateUser);

router.post(
  "/transcribe",
  upload.single("audio"),
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const { text, result } = await transcribeAudio(req.file);

      res.json({
        text,
        result,
      });
    } catch (err: any) {
      console.error("Transcription error:", err.message);
      res.status(500).json({
        error: err.message || "Failed to transcribe audio",
      });
    }
  }
);

export default router;
