import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db.js";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
