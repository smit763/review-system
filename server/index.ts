import express from "express";
import connectDB from "./config/db";
import config from "./config/config";
import cors from "cors";

import reviewRoutes from "./routes/ReviewRoutes";
import userRoutes from "./routes/UserRoutes";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", reviewRoutes);
app.use("/api",userRoutes)

connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
