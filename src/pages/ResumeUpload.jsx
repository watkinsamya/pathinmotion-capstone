import { useState } from "react";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Divider, Badge } from "../components/UI";
import { useApp } from "../context/AppContext";

const SAMPLE_RESUME = `Amya Watkins
Software Engineering student with experience in React, JavaScript, SQL, UI/UX, Figma, testing, Git, and API-based applications.
Built mobile-first web interfaces and collaborated on software projects with focus on usability and design systems.
Experience with resume-friendly project documentation, front-end development, and communication in team environments.`;

export default function ResumeUpload() {
  const { state, actions } = useApp();

  const [resumeText, setResumeText] = useState(state.resumeText || "");
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // 🔥 ANALYZE (WORKS FOR BOTH upload + paste)
  async function handleAnalyzeResume() {
    const textToAnalyze = (resumeText || uploadedResumeText).trim();

    if (!textToAnalyze) {
      setError("Please upload a file or paste resume text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText: textToAnalyze }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      actions.setResumeAnalysis({
        resumeText: textToAnalyze,
        skills: data.skills || [],
        summary: data.summary || "",
        targetRoles: data.targetRoles || [],
      });

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 FILE UPLOAD (REAL BACKEND)
  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError("");
    setUploadSuccess("");
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const raw = await res.text();
      console.log("UPLOAD RAW:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Server returned HTML instead of JSON.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const extractedText = (data.text || "").trim();

      if (!extractedText) {
        throw new Error("No text could be extracted from file.");
      }

      setUploadedResumeText(extractedText);
      setResumeText(extractedText);

      setUploadSuccess("Resume uploaded successfully. Click Analyze.");

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setUploadedResumeText("");
      setResumeText("");
      setError(err.message || "Upload failed.");
    } finally {
      setUploadingFile(false);
    }
  }

  function handleUseSample() {
    setResumeText(SAMPLE_RESUME);
    setUploadedResumeText("");
    setError("");
    setUploadSuccess("Using sample resume.");
  }

  function handleClear() {
    setResumeText("");
    setUploadedResumeText("");
    setUploadedFileName("");
    setError("");
    setUploadSuccess("");
    actions.clearResume();
  }

  return (
    <>
      <AppShell title="Resume">
        <div className="space-y-4">

          {/* HEADER */}
          <Card className="bg-gradient-to-b from-white to-slate-100 text-brand-ink">
            <h2 className="text-xl font-semibold">
              Resume Upload & AI Analysis
            </h2>

            <p className="text-sm text-black/60 mt-1">
              Upload a file OR paste your resume. AI will extract skills and generate matches.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {state.resumeUploaded ? (
                <Badge tone="success">Resume analyzed</Badge>
              ) : (
                <Badge tone="warn">No resume analyzed</Badge>
              )}
              <Badge>{state.extractedSkills.length} skills found</Badge>
            </div>

            <Divider className="my-4" />

            {/* FILE UPLOAD */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-black/70">
                Upload resume file
              </label>

              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileUpload}
                className="block w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
              />

              {uploadedFileName && (
                <p className="text-xs text-black/60">
                  Selected file: {uploadedFileName}
                </p>
              )}

              {uploadSuccess && (
                <p className="text-sm text-green-600">{uploadSuccess}</p>
              )}

              {/* TEXT INPUT */}
              <label className="text-sm font-medium text-black/70">
                Or paste resume text
              </label>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full min-h-[180px] rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            {/* BUTTONS */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={handleAnalyzeResume}
                disabled={loading || uploadingFile}
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>

              <Button variant="secondary" onClick={handleUseSample}>
                Use Sample
              </Button>

              <Button variant="secondary" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </Card>

          {/* AI SUMMARY */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">AI Summary</h3>
            <p className="mt-2 text-sm text-black/70">
              {state.resumeSummary || "Analyze a resume to see a summary."}
            </p>
          </Card>

          {/* SKILLS */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">Extracted Skills</h3>
            {state.extractedSkills.length === 0 ? (
              <p className="mt-2 text-sm text-black/60">
                No skills extracted yet.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {state.extractedSkills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            )}
          </Card>

          {/* ROLES */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">Suggested Target Roles</h3>
            {state.targetRoles.length === 0 ? (
              <p className="mt-2 text-sm text-black/60">
                No roles suggested yet.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {state.targetRoles.map((role) => (
                  <Badge key={role} tone="pink">
                    {role}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}