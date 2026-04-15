import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
import { PDFParse } from "@cedrugs/pdf-parse";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Resume server running" });
});

// upload + extract text
app.post("/api/upload-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const file = req.file;
    const filename = file.originalname.toLowerCase();
    let extractedText = "";

    console.log("UPLOAD FILE:", file.originalname, file.mimetype);

    if (filename.endsWith(".txt")) {
      extractedText = file.buffer.toString("utf-8");
    } else if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || "";
    } else if (filename.endsWith(".pdf")) {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      extractedText = result.text || "";
    } else {
      return res.status(400).json({
        error: "Unsupported file type. Upload .txt, .pdf, or .docx.",
      });
    }

    extractedText = extractedText.trim();

    console.log("EXTRACTED LENGTH:", extractedText.length);
    console.log("EXTRACTED PREVIEW:", extractedText.slice(0, 300));

    if (!extractedText) {
      return res.status(400).json({
        error:
          "No readable text was extracted from this file. Try another PDF/DOCX or paste the resume text manually.",
      });
    }

    return res.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      error: "Failed to extract text from uploaded file.",
      details: error.message,
    });
  }
});

// analyze extracted or pasted text
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a resume analysis assistant. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content: `
Analyze this resume and return ONLY JSON in this exact shape:
{
  "summary": "short summary",
  "skills": ["skill1", "skill2"],
  "targetRoles": ["role1", "role2"]
}

Resume:
${resumeText}
          `,
        },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "AI returned invalid JSON.",
        raw,
      });
    }

    return res.json({
      summary: parsed.summary || "",
      skills: parsed.skills || [],
      targetRoles: parsed.targetRoles || [],
    });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    return res.status(500).json({
      error: "Failed to analyze resume.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});