import { useMemo } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider } from "../components/UI";
import { jobs as JOBS } from "../data/jobs";
import { useApp } from "../context/AppContext";

export default function JobDetails() {
  const { id } = useParams();
  const { state, actions } = useApp();

  const job = useMemo(() => JOBS.find((j) => j.id === id), [id]);
  const isSaved = job ? state.savedJobs.includes(job.id) : false;

  if (!job) {
    return (
      <>
        <AppShell title="Job details">
          <Card className="text-brand-ink">
            <h2 className="text-lg font-semibold">Job not found</h2>
            <p className="text-sm text-black/60 mt-2">
              The job you selected doesn’t exist in the current dataset.
            </p>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <AppShell title="Job details">
        <Card className="text-brand-ink">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-black/60 mt-1">{job.company}</p>
              <p className="text-xs text-black/50 mt-2">
                {job.location} • {job.type} • {job.salary}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>

            <Badge tone={job.location.toLowerCase().includes("remote") ? "success" : "default"}>
              {job.location.toLowerCase().includes("remote") ? "Remote" : "On-site/Hybrid"}
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

          <div className="mt-5 flex gap-3">
            <Button
              className="flex-1"
              variant={isSaved ? "primary" : "secondary"}
              onClick={() => actions.toggleSavedJob(job.id)}
            >
              {isSaved ? "Saved" : "Save job"}
            </Button>

            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => alert("Demo: Apply flow coming in Sprint 3")}
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