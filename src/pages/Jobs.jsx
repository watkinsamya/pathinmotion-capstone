import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Input, Divider } from "../components/UI";
import { jobs } from "../data/jobs";
import { useApp } from "../context/AppContext";

export default function Jobs() {
  const { state, actions } = useApp();
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const q = query.toLowerCase();

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <>
      <AppShell title="Jobs">
        <div className="space-y-4">
          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Browse Jobs</h2>
            <p className="text-sm text-black/60 mt-1">
              Search roles, view details, save jobs, and apply.
            </p>

            <Input
              className="mt-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company, skill, or location..."
            />
          </Card>

          <Divider />

          {filteredJobs.map((job) => {
            const isSaved = state.savedJobs.includes(job.id);
            const isApplied = state.appliedJobs.some((app) => app.id === job.id);

            return (
              <Card key={job.id} className="text-brand-ink">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-black/60">{job.company}</p>
                    <p className="text-xs text-black/45 mt-1">
                      {job.location} • {job.type} • {job.salary}
                    </p>
                  </div>

                  {isApplied ? (
                    <Badge tone="success">Applied</Badge>
                  ) : (
                    <Badge>{job.location}</Badge>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} tone="pink">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <Link to={`/jobs/${job.id}`} className="flex-1">
                    <Button className="w-full">View</Button>
                  </Link>

                  <Button
                    variant={isSaved ? "primary" : "secondary"}
                    className="flex-1"
                    onClick={() => actions.toggleSavedJob(job.id)}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button
                    variant={isApplied ? "secondary" : "primary"}
                    className="flex-1"
                    onClick={() => actions.applyToJob(job.id)}
                    disabled={isApplied}
                  >
                    {isApplied ? "Applied" : "Apply"}
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