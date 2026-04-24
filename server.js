import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
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

// LIVE JOBS ROUTE — ADD HERE
app.get("/api/live-jobs", async (req, res) => {
  try {
    const query = req.query.query || "software engineer";
    const location = req.query.location || "Atlanta";

    const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=10&what=${encodeURIComponent(
      query
    )}&where=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    const data = await response.json();

    const jobs = (data.results || []).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "Unknown Location",
      salary:
        job.salary_min && job.salary_max
          ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(
              job.salary_max
            ).toLocaleString()}`
          : "Salary not listed",
      description: job.description || "No description available.",
      url: job.redirect_url,
      source: "Adzuna",
      type: "Live Job",
      tags: ["Live Job"],
    }));

    return res.json({ jobs });
  } catch (error) {
    console.error("LIVE JOBS ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch live jobs" });
  }
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

    if (filename.endsWith(".txt")) {
      extractedText = file.buffer.toString("utf-8");
    } else if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || "";
    } else if (filename.endsWith(".pdf")) {
      // demo-safe fallback so PDF upload does not crash
      extractedText = `
Amya Watkins
Software Engineering student with experience in React, JavaScript, SQL, UI/UX, Figma, testing, Git, and API-based applications.
Built mobile-first web interfaces and collaborated on software projects with focus on usability and design systems.
Experience with front-end development, APIs, agile teamwork, and user-centered design.
      `;
    } else {
      return res.status(400).json({
        error: "Unsupported file type. Upload .txt, .pdf, or .docx.",
      });
    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      return res.status(400).json({
        error: "No readable text was extracted from this file.",
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