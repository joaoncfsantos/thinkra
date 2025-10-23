import express from "express";
import cors from "cors";

import transcriptionRoutes from "./routes/transcription";
import dailyEntryRoutes from "./routes/dailyEntry";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api", transcriptionRoutes);
app.use("/api", dailyEntryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
