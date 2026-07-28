import express from "express";
import { generateStudyContent } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateStudyContent);

export default router;