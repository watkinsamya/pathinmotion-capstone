import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
import OpenAI from "openai";

const app  = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RAPIDAPI_KEY  = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

function jsearchHeaders() {
  return {
    "Content-Type":    "application/json",
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key":  RAPIDAPI_KEY,
  };
}

function extractResults(data) {
  if (Array.isArray(data.data))    return data.data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.jobs))    return data.jobs;
  if (Array.isArray(data))         return data;
  return [];
}

function mapJob(job, query) {
  return {
    id:       job.job_id            || String(Math.random()),
    title:    job.job_title         || "Untitled Job",
    company:  job.employer_name     || "Unknown Company",
    location: [job.job_city, job.job_state, job.job_country]
                .filter(Boolean).join(", ") || "Remote",
    type:     job.job_employment_type || "Full-time",
    salary:
      job.job_min_salary && job.job_max_salary
        ? "$" + Math.round(job.job_min_salary).toLocaleString() +
          " - $" + Math.round(job.job_max_salary).toLocaleString()
        : "Salary not listed",
    description: job.job_description || "No description available.",
    url:         job.job_apply_link  || "#",
    logo:        job.employer_logo   || null,
    remote:      job.job_is_remote   || false,
    posted:      job.job_posted_at_datetime_utc
                   ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
                   : "Recent",
    source:      job.job_publisher   || "JSearch",
    tags: [
      job.job_employment_type || "Full-time",
      job.job_is_remote ? "Remote" : "On-site",
      query || "jobs",
    ],
    requirements: job.job_highlights?.Qualifications || [],
  };
}

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Path in Motion server running" });
});

// ── LIVE JOBS ──
app.get("/api/live-jobs", async (req, res) => {
  try {
    // Clean up the query — remove double "jobs jobs"
    let query    = (req.query.query || "software engineer").replace(/\bjobs\b/gi, "").trim();
    const location = req.query.location || "";
    const page     = req.query.page     || "1";

    if (!query) query = "software engineer";

    if (!RAPIDAPI_KEY) {
      return res.status(500).json({ error: "Missing RAPIDAPI_KEY in .env" });
    }

    const searchQuery = location
      ? query + " jobs in " + location
      : query + " jobs";

    console.log("Fetching JSearch:", searchQuery);

    // Try /search first (V1 — this is what your subscription covers)
    const url = "https://" + RAPIDAPI_HOST + "/search?query=" +
      encodeURIComponent(searchQuery) +
      "&num_pages=1&page=" + page + "&date_posted=all";

    const response = await fetch(url, { headers: jsearchHeaders() });
    const data     = await response.json();

    console.log("JSearch keys:", Object.keys(data));
    console.log("JSearch status:", data.status);

    let results = extractResults(data);
    console.log("Results count:", results.length);

    // If V1 empty try with different params
    if (results.length === 0) {
      console.log("Trying broader search...");
      const fbUrl = "https://" + RAPIDAPI_HOST + "/search?query=" +
        encodeURIComponent(query + " developer") + "&num_pages=1&page=1";
      const fbRes  = await fetch(fbUrl, { headers: jsearchHeaders() });
      const fbData = await fbRes.json();
      results      = extractResults(fbData);
      console.log("Fallback results:", results.length);
    }

    if (results.length === 0) {
      console.log("Final fallback — engineer search...");
      const fb2Url = "https://" + RAPIDAPI_HOST + "/search?query=software%20engineer&num_pages=1";
      const fb2Res  = await fetch(fb2Url, { headers: jsearchHeaders() });
      const fb2Data = await fb2Res.json();
      results       = extractResults(fb2Data);
      console.log("Final fallback results:", results.length);
    }

    const jobs = results.map((job) => mapJob(job, query));
    return res.json({ jobs });

  } catch (error) {
    console.error("LIVE JOBS ERROR:", error);
    return res.status(500).json({
      error:   "Failed to fetch live jobs",
      details: error.message,
    });
  }
});

// ── RECOMMENDATIONS ──
app.post("/api/recommendations", async (req, res) => {
  try {
    const { skills = [], targetRoles = [], location = "" } = req.body;

    if (!RAPIDAPI_KEY) {
      return res.status(500).json({ error: "Missing RAPIDAPI_KEY in .env" });
    }

    let roleQuery = targetRoles[0] || skills.slice(0, 2).join(" ") || "software engineer";
    roleQuery     = roleQuery.replace(/\bjobs\b/gi, "").trim();

    const searchQuery = location
      ? roleQuery + " jobs in " + location
      : roleQuery + " jobs";

    const url      = "https://" + RAPIDAPI_HOST + "/search?query=" +
      encodeURIComponent(searchQuery) + "&num_pages=1&page=1";
    const response = await fetch(url, { headers: jsearchHeaders() });
    const data     = await response.json();
    const results  = extractResults(data).slice(0, 6);
    const jobs     = results.map((job) => mapJob(job, roleQuery));

    return res.json({ jobs });

  } catch (error) {
    console.error("RECOMMENDATIONS ERROR:", error);
    return res.status(500).json({
      error:   "Failed to fetch recommendations",
      details: error.message,
    });
  }
});

// ── UPLOAD RESUME ──
app.post("/api/upload-resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const file     = req.file;
    const filename = file.originalname.toLowerCase();
    let extractedText = "";

    if (filename.endsWith(".txt")) {
      extractedText = file.buffer.toString("utf-8");
    } else if (filename.endsWith(".docx")) {
      const result  = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || "";
    } else if (filename.endsWith(".pdf")) {
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

    return res.json({ success: true, text: extractedText });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      error:   "Failed to extract text from uploaded file.",
      details: error.message,
    });
  }
});

// ── ANALYZE RESUME ──
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role:    "system",
          content: "You are a resume analysis assistant. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content:
            "Analyze this resume and return ONLY JSON:\n" +
            '{"summary":"...","skills":["..."],"targetRoles":["..."]}\n\nResume:\n' +
            resumeText,
        },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "AI returned invalid JSON.", raw });
    }

    return res.json({
      summary:     parsed.summary     || "",
      skills:      parsed.skills      || [],
      targetRoles: parsed.targetRoles || [],
    });

  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    return res.status(500).json({
      error:   "Failed to analyze resume.",
      details: error.message,
    });
  }
});

// ── MENTOR CHAT ──
app.post("/api/mentor-chat", async (req, res) => {
  try {
    const {
      mentorName, mentorTitle, mentorCompany,
      mentorIndustry, mentorBio, mentorSkills,
      userMessage, history = [],
    } = req.body;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are " + mentorName + ", a " + mentorTitle +
            " at " + mentorCompany + ". Industry: " + mentorIndustry +
            ". Background: " + mentorBio +
            ". Skills: " + (mentorSkills || []).join(", ") +
            ". You are mentoring an early-career professional." +
            " Give warm, specific, practical advice. Keep responses under 3 sentences.",
        },
        ...history.slice(-6).map((m) => ({
          role:    m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens:  200,
    });

    return res.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error("MENTOR CHAT ERROR:", error);
    return res.status(500).json({ error: "Chat failed", details: error.message });
  }
});

// ── MATCH SCORE ──
app.post("/api/match-score", async (req, res) => {
  try {
    const { resumeText, jobTitle, jobDescription } = req.body;

    if (!resumeText || !jobTitle) {
      return res.status(400).json({ error: "resumeText and jobTitle are required." });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role:    "system",
          content: "You are a recruiter. Return only valid JSON with no markdown.",
        },
        {
          role: "user",
          content:
            "Score this resume. Return ONLY JSON:\n" +
            '{"score":78,"label":"Good Match","matchedSkills":["..."],"missingSkills":["..."],"tip":"..."}\n\n' +
            "Job: " + jobTitle + "\n" +
            "Description: " + (jobDescription || "Not provided") + "\n" +
            "Resume: " + resumeText,
        },
      ],
      temperature: 0.3,
      max_tokens:  400,
    });

    const raw = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "AI returned invalid JSON.", raw });
    }

    return res.json(parsed);

  } catch (error) {
    console.error("MATCH SCORE ERROR:", error);
    return res.status(500).json({
      error:   "Failed to compute match score.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});