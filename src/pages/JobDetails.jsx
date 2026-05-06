import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider } from "../components/UI";
import { jobs as FALLBACK_JOBS } from "../data/jobs";
import { useApp } from "../context/AppContext";
import { calculateMatchScore } from "../lib/matchScore";

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { state, actions } = useApp();

  const jobFromState = location.state?.job;

  const job = useMemo(() => {
    return jobFromState || FALLBACK_JOBS.find((j) => j.id === id);
  }, [id, jobFromState]);

  if (!job) {
    return (
      <>
        <AppShell title="Job details">
          <Card className="text-brand-ink">
            <h2 className="text-lg font-semibold">Job not found</h2>
            <p className="text-sm text-black/60 mt-2">
              The selected job does not exist.
            </p>
            <Link to="/jobs">
              <Button className="mt-4">Back to Jobs</Button>
            </Link>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  const requirements = job.requirements || job.tags || ["Live job"];
  const match = calculateMatchScore(state.extractedSkills || [], requirements);

  const isSavedJob = state.savedJobs?.includes(job.id);
  const isApplied = state.appliedJobs?.some((app) => app.id === job.id);

  return (
    <>
      <AppShell title="Job details">
        <Card className="text-brand-ink">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-black/60 mt-1">{job.company}</p>
              <p className="text-xs text-black/50 mt-2">
                {job.location} • {job.type || "Live Job"} • {job.salary}
              </p>
            </div>

            <Badge tone={match.score >= 70 ? "success" : match.score >= 40 ? "warn" : "pink"}>
              {match.score}% Match
            </Badge>
          </div>

          <Divider className="my-4" />

          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-black/70 mt-2 leading-relaxed">
            {job.description || "No description available."}
          </p>

          <Divider className="my-4" />

          <h3 className="font-semibold">Requirements</h3>
          <ul className="mt-2 text-sm text-black/70 space-y-1 list-disc pl-5">
            {requirements.map((r) => (
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
              className={isApplied ? "w-full" : "flex-1"}
              onClick={() => actions.toggleSavedJob(job.id)}
            >
              {isSavedJob ? "Saved Job" : "Save Job"}
            </Button>

            {!isApplied && (
              <Link to={`/apply/${job.id}`} state={{ job }} className="flex-1">
                <Button className="w-full">Apply</Button>
              </Link>
            )}
          </div>

          {isApplied && (
            <p className="mt-3 text-sm text-green-700 font-medium">
              This job has been added to your application tracker.
            </p>
          )}

          {job.url && job.url !== "#" && (
            <a href={job.url} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="w-full mt-3">
                View Original Posting
              </Button>
            </a>
          )}
        </Card>
      </AppShell>

      <BottomNav />
    </>
  );
}