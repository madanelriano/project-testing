import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/videos", videoRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});