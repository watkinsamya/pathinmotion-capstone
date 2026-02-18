import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { useApp } from "../context/AppContext";

const jobs = [
  { id: "job-1", title: "Frontend Developer Intern", company: "Detroit Tech Co", meta: "Remote • $25/hr", score: 86 },
  { id: "job-2", title: "UI/UX Designer", company: "Creative Studio", meta: "Hybrid • $70k", score: 79 },
  { id: "job-3", title: "Software QA Engineer", company: "AutoTech", meta: "On-site • $78k", score: 74 },
];

export default function Matches() {
  const { state, actions } = useApp();

  return (
    <>
      <AppShell title="Matches">
        <div className="space-y-4">
          {jobs.map((job) => {
            const isSaved = state.savedMatches.includes(job.id);

            return (
              <Card key={job.id} className="hover:bg-black/[0.02] transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-black/90">{job.title}</h3>
                    <p className="text-black/60 text-sm">{job.company}</p>
                    <p className="text-black/45 text-xs mt-1">{job.meta}</p>
                  </div>

                  <Badge tone="success">{job.score}%</Badge>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button className="flex-1" onClick={() => alert("Demo: View details coming next sprint!")}>
                    View
                  </Button>

                  <Button
                    variant={isSaved ? "primary" : "secondary"}
                    className="flex-1"
                    onClick={() => actions.toggleSavedMatch(job.id)}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
