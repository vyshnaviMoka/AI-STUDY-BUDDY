import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateContent(notes, subject, difficulty, flashcardCount) {
  const prompt = `
Generate study material from the notes below.

Return ONLY valid JSON in this format:

{
  "flashcards":[
    {
      "question":"...",
      "answer":"..."
    }
  ],
  "quiz":[
    {
      "question":"...",
      "options":["A","B","C","D"],
      "correctAnswer":"..."
    }
  ],
  "summary":"..."
}

Notes:
${notes}

Subject: ${subject}
Difficulty: ${difficulty}

Generate exactly ${flashcardCount} flashcards.
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  return response.text;
}