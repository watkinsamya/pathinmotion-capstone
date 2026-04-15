import { useMemo } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider } from "../components/UI";
import { jobs as JOBS } from "../data/jobs";
import { useApp } from "../context/AppContext";
import { calculateMatchScore } from "../lib/matchScore";

export default function JobDetails() {
  const { id } = useParams();
  const { state, actions } = useApp();

  const job = useMemo(() => JOBS.find((j) => j.id === id), [id]);

  if (!job) {
    return (
      <>
        <AppShell title="Job details">
          <Card className="text-brand-ink">
            <h2 className="text-lg font-semibold">Job not found</h2>
            <p className="text-sm text-black/60 mt-2">
              The selected job does not exist.
            </p>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  const match = calculateMatchScore(state.extractedSkills, job.requirements);
  const isSavedJob = state.savedJobs.includes(job.id);

  return (
    <>
      <AppShell title="Job details">
        <Card className="text-brand-ink">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-black/60 mt-1">{job.company}</p>
              <p className="text-xs text-black/50 mt-2">
                {job.location} • {job.type} • {job.salary}
              </p>
            </div>

            <Badge tone={match.score >= 70 ? "success" : match.score >= 40 ? "warn" : "pink"}>
              {match.score}% Match
            </Badge>
          </div>

          <Divider className="my-4" />

          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-black/70 mt-2 leading-relaxed">
            {job.description}
          </p>

          <Divider className="my-4" />

          <h3 className="font-semibold">Requirements</h3>
          <ul className="mt-2 text-sm text-black/70 space-y-1 list-disc pl-5">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <Divider className="my-4" />

          <h3 className="font-semibold">Why this matched</h3>
          <p className="text-sm text-black/70 mt-2">
            <strong>Matched skills:</strong>{" "}
            {match.matchedSkills.length > 0 ? match.matchedSkills.join(", ") : "None yet"}
          </p>
          <p className="text-sm text-black/70 mt-2">
            <strong>Missing skills:</strong>{" "}
            {match.missingSkills.length > 0 ? match.missingSkills.join(", ") : "None"}
          </p>

          <div className="mt-5 flex gap-3">
            <Button
              variant={isSavedJob ? "primary" : "secondary"}
              className="flex-1"
              onClick={() => actions.toggleSavedJob(job.id)}
            >
              {isSavedJob ? "Saved Job" : "Save Job"}
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => alert("Demo: Apply flow coming next sprint")}
            >
              Apply
            </Button>
          </div>
        </Card>
      </AppShell>

      <BottomNav />
    </>
  );
}