import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Divider, Badge } from "../components/UI";

export default function ResumeUpload() {
  function handleFakeUpload() {
    localStorage.setItem("pm_resume_uploaded", "true");
    alert("Demo: Resume uploaded ✅");
  }

  function handleClear() {
    localStorage.removeItem("pm_resume_uploaded");
    alert("Demo: Resume cleared");
  }

  const uploaded = localStorage.getItem("pm_resume_uploaded") === "true";

  return (
    <>
      <AppShell title="Resume">
        <div className="space-y-4">
          {/* Upload Card */}
          <Card className="bg-gradient-to-b from-white to-slate-100 text-brand-ink">
            <h2 className="text-xl font-semibold">Resume Upload</h2>
            <p className="text-sm text-black/60 mt-1">
              Upload once so PathinMotion can generate smarter matches.
            </p>

            <div className="mt-4 flex gap-2">
              {uploaded ? (
                <Badge tone="success">Uploaded</Badge>
              ) : (
                <Badge tone="warn">Not uploaded</Badge>
              )}
              <Badge>PDF • DOCX</Badge>
            </div>

            <Divider className="my-4" />

            <div className="rounded-2xl border border-dashed border-black/15 bg-white/70 p-5 text-center">
              <p className="text-sm text-black/70">
                Drag & drop your resume here (demo)
              </p>
              <p className="text-xs text-black/45 mt-1">
                For now, we’re simulating upload while the backend comes next.
              </p>

              <div className="mt-4 flex gap-3">
                <Button className="flex-1" onClick={handleFakeUpload}>
                  Upload
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* What Happens Next */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="mt-2 text-sm text-black/70 space-y-1 list-disc pl-5">
              <li>Extract skills and keywords from your resume</li>
              <li>Compare your experience to job requirements</li>
              <li>Generate match scores and personalized recommendations</li>
            </ul>
          </Card>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
