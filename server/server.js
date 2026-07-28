import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AI Study Buddy Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Say hello",
    });

    res.json({
      success: true,
      text: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});