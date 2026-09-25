import express from "express";
import cors from "cors";
import transcriptionRoutes from "./routes/transcription";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use("/api", transcriptionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
