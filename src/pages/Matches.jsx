import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { useApp } from "../context/AppContext";
import { jobs as JOBS } from "../data/jobs";
import { calculateMatchScore } from "../lib/matchScore";

export default function Matches() {
  const { state, actions } = useApp();

  const matchedJobs = JOBS.map((job) => {
    const result = calculateMatchScore(state.extractedSkills, job.requirements);
    return {
      ...job,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <>
      <AppShell title="AI Matches">
        <Card className="text-brand-ink">
          <h2 className="text-lg font-semibold">Your AI-powered matches</h2>
          <p className="text-sm text-black/60 mt-1">
            Jobs are ranked using AI-extracted resume skills compared against job requirements.
          </p>

          {!state.resumeUploaded && (
            <p className="mt-3 text-sm text-black/70">
              Analyze a resume first to generate personalized match scores.
            </p>
          )}
        </Card>

        <div className="mt-4 space-y-4">
          {matchedJobs.map((job) => {
            const isSaved = state.savedMatches.includes(job.id);

            return (
              <Card key={job.id} className="hover:bg-black/[0.02] transition text-brand-ink">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black/90">{job.title}</h3>
                    <p className="text-black/60 text-sm">{job.company}</p>
                    <p className="text-black/45 text-xs mt-1">
                      {job.location} • {job.type} • {job.salary}
                    </p>
                  </div>

                  <Badge tone={job.score >= 70 ? "success" : job.score >= 40 ? "warn" : "pink"}>
                    {job.score}%
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-black/60">
                  Matched skills:{" "}
                  {job.matchedSkills.length > 0
                    ? job.matchedSkills.join(", ")
                    : "No strong match yet"}
                </p>

                <div className="mt-4 flex gap-3">
                  <Link to={`/jobs/${job.id}`} className="flex-1">
                    <Button className="w-full">View</Button>
                  </Link>

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