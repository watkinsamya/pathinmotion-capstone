import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { useApp } from "../context/AppContext";

// AI Matches are a curated list with match scores.
// For now this is mock data (Sprint 2/3 can replace with real scoring).
const matchedJobs = [
  {
    id: "job-frontend-intern",
    title: "Frontend Developer Intern",
    company: "Detroit Tech Co",
    meta: "Remote • $25/hr",
    score: 86,
  },
  {
    id: "job-uiux-designer",
    title: "UI/UX Designer",
    company: "Creative Studio",
    meta: "Hybrid • $70k",
    score: 79,
  },
  {
    id: "job-qa-engineer",
    title: "Software QA Engineer",
    company: "AutoTech",
    meta: "On-site • $78k",
    score: 74,
  },
];

export default function Matches() {
  const { state, actions } = useApp();

  return (
    <>
      <AppShell title="AI Matches">
        <Card className="text-brand-ink">
          <h2 className="text-lg font-semibold">Your AI matches</h2>
          <p className="text-sm text-black/60 mt-1">
            These roles are ranked by fit based on your profile + resume (mocked for now).
          </p>
        </Card>

        <div className="mt-4 space-y-4">
          {matchedJobs.map((job) => {
            const isSaved = state.savedMatches.includes(job.id);

            return (
              <Card key={job.id} className="hover:bg-black/[0.02] transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black/90 truncate">{job.title}</h3>
                    <p className="text-black/60 text-sm">{job.company}</p>
                    <p className="text-black/45 text-xs mt-1">{job.meta}</p>
                  </div>

                  <Badge tone="success">{job.score}%</Badge>
                </div>

                <div className="mt-4 flex gap-3">
                  {/* View job details */}
                  <Link to={`/jobs/${job.id}`} className="flex-1">
                    <Button className="w-full">View</Button>
                  </Link>

                  {/* Save match */}
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