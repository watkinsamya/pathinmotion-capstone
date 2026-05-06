import { useState } from "react";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Divider, Badge } from "../components/UI";
import { useApp } from "../context/AppContext";

export default function ResumeUpload() {
  const { state, actions } = useApp();

  const [activeTab,        setActiveTab]        = useState("upload");
  const [pasteText,        setPasteText]        = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedText,     setUploadedText]     = useState("");
  const [loading,          setLoading]          = useState(false);
  const [uploading,        setUploading]        = useState(false);
  const [error,            setError]            = useState("");
  const [uploadSuccess,    setUploadSuccess]    = useState("");

  // ── File upload handler ──
  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadSuccess("");
    setUploadedFileName(file.name);
    setUploadedText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res  = await fetch("/api/upload-resume", {
        method: "POST",
        body:   formData,
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Server returned invalid response.");
      }

      if (!res.ok) throw new Error(data.error || "Upload failed");

      const extracted = (data.text || "").trim();
      if (!extracted) throw new Error("No text could be extracted from this file.");

      // Store text internally — DO NOT show it in a textarea
      setUploadedText(extracted);
      setUploadSuccess("Resume uploaded successfully. Click Analyze.");
    } catch (err) {
      setUploadedText("");
      setUploadedFileName("");
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  // ── Analyze handler ──
  async function handleAnalyze() {
    const textToAnalyze = activeTab === "upload"
      ? uploadedText
      : pasteText.trim();

    if (!textToAnalyze) {
      setError(activeTab === "upload"
        ? "Please upload a resume file first."
        : "Please paste your resume text first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze-resume", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ resumeText: textToAnalyze }),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Server returned invalid response.");
      }

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      actions.setResumeAnalysis({
        resumeText:  textToAnalyze,
        skills:      data.skills      || [],
        summary:     data.summary     || "",
        targetRoles: data.targetRoles || [],
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── Clear handler ──
  function handleClear() {
    setUploadedText("");
    setUploadedFileName("");
    setUploadSuccess("");
    setPasteText("");
    setError("");
    actions.clearResume();
    // Reset file input
    const input = document.getElementById("resume-file-input");
    if (input) input.value = "";
  }

  return (
    <>
      <AppShell title="Resume">
        <div className="space-y-4">

          {/* Header card */}
          <Card className="bg-gradient-to-b from-white to-slate-100 text-brand-ink">
            <h2 className="text-xl font-semibold">Resume Analysis</h2>
            <p className="text-sm text-black/60 mt-1">
              Upload your resume or paste the text. We will extract your skills
              and generate AI-powered career matches.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {state.resumeUploaded ? (
                <Badge tone="success">Resume analyzed</Badge>
              ) : (
                <Badge tone="warn">No resume analyzed</Badge>
              )}
              <Badge>{state.extractedSkills?.length || 0} skills found</Badge>
            </div>

            <Divider className="my-4" />

            {/* Tab switcher */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setActiveTab("upload"); setError(""); }}
                className={
                  "flex-1 py-2 rounded-xl text-sm font-semibold border transition-all " +
                  (activeTab === "upload"
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-black/60 border-black/10")
                }
              >
                Upload File
              </button>
              <button
                onClick={() => { setActiveTab("paste"); setError(""); }}
                className={
                  "flex-1 py-2 rounded-xl text-sm font-semibold border transition-all " +
                  (activeTab === "paste"
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-black/60 border-black/10")
                }
              >
                Paste Text
              </button>
            </div>

            {/* Upload tab */}
            {activeTab === "upload" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-black/70">
                  Upload your resume (.pdf, .docx, or .txt)
                </label>

                <input
                  id="resume-file-input"
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="block w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {uploading && (
                  <p className="text-sm text-black/50">Uploading...</p>
                )}

                {uploadedFileName && !uploading && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <span className="text-green-600 text-lg">✅</span>
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        {uploadedFileName}
                      </p>
                      {uploadSuccess && (
                        <p className="text-xs text-green-600">{uploadSuccess}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Paste tab */}
            {activeTab === "paste" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-black/70">
                  Paste your resume text below
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste the full text of your resume here..."
                  rows={8}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50 resize-none"
                />
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={loading || uploading}
                className="flex-1"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>

              <Button
                variant="secondary"
                onClick={handleClear}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </Card>

          {/* AI Summary */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">AI Summary</h3>
            <p className="mt-2 text-sm text-black/70">
              {state.resumeSummary || "Analyze a resume to see your summary here."}
            </p>
          </Card>

          {/* Extracted Skills */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">Extracted Skills</h3>
            {!state.extractedSkills || state.extractedSkills.length === 0 ? (
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

          {/* Target Roles */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">Suggested Target Roles</h3>
            {!state.targetRoles || state.targetRoles.length === 0 ? (
              <p className="mt-2 text-sm text-black/60">
                No roles suggested yet.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {state.targetRoles.map((role) => (
                  <Badge key={role} tone="pink">{role}</Badge>
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