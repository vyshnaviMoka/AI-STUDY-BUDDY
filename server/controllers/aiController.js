import { generateContent } from "../services/geminiService.js";

export const generateStudyContent = async (req, res) => {
  try {
    const { notes, subject, difficulty, flashcardCount } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: "Notes are required.",
      });
    }

    const result = await generateContent(
      notes,
      subject,
      difficulty,
      flashcardCount
    );

    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};