import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Divider, Badge } from "../components/UI";

export default function ResumeUpload() {
  function handleFakeUpload() {
    // demo-only: mark resume as uploaded
    localStorage.setItem("pm_resume_uploaded", "true");
    alert("Demo: Resume uploaded ✅");
  }

  const uploaded = localStorage.getItem("pm_resume_uploaded") === "true";

  return (
    <>
      <AppShell title="Resume">
        <div className="space-y-4">
          <Card className="bg-gradient-to-b from-white/10 to-slate-900/60">
            <h2 className="text-xl font-semibold">Resume Upload</h2>
            <p className="text-sm text-white/60 mt-1">
              Upload once so PathinMotion can generate smarter matches.
            </p>

            <div className="mt-4 flex gap-2">
              {uploaded ? <Badge tone="success">Uploaded</Badge> : <Badge tone="warning">Not uploaded</Badge>}
              <Badge>PDF • DOCX</Badge>
            </div>

            <Divider className="my-4" />

            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-center">
              <p className="text-sm text-white/70">
                Drag & drop your resume here (demo)
              </p>
              <p className="text-xs text-white/45 mt-1">
                For now, we’re simulating upload while the backend comes next.
              </p>

              <div className="mt-4 flex gap-3">
                <Button className="flex-1" onClick={handleFakeUpload}>
                  Upload
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    localStorage.removeItem("pm_resume_uploaded");
                    alert("Demo: Resume cleared");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="mt-2 text-sm text-white/60 space-y-1 list-disc pl-5">
              <li>Extract skills + keywords</li>
              <li>Compare to job requirements</li>
              <li>Generate a match score + recommendations</li>
            </ul>
          </Card>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
