import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider } from "../components/UI";
import { useApp } from "../context/AppContext";
import { jobs as JOBS } from "../data/jobs";

export default function SavedJobs() {
  const { state, actions } = useApp();

  const saved = JOBS.filter((j) => state.savedJobs.includes(j.id));

  return (
    <>
      <AppShell title="Saved Jobs">
        <Card className="text-brand-ink">
          <h2 className="text-lg font-semibold">Your saved jobs</h2>
          <p className="text-sm text-black/60 mt-1">
            These are jobs you saved while browsing. (Matches saved separately.)
          </p>
        </Card>

        <Divider className="my-4" />

        {saved.length === 0 ? (
          <Card className="text-brand-ink">
            <p className="text-sm text-black/70">
              You haven’t saved any jobs yet. Browse jobs and tap <strong>Save</strong>.
            </p>
            <div className="mt-4">
              <Link to="/jobs">
                <Button>Browse jobs</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {saved.map((job) => (
              <Card key={job.id} className="hover:bg-black/[0.02] transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black/90 truncate">{job.title}</h3>
                    <p className="text-black/60 text-sm">{job.company}</p>
                    <p className="text-black/45 text-xs mt-1">
                      {job.location} • {job.type} • {job.salary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.tags?.slice(0, 3)?.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>

                  <Badge tone="pink">Saved</Badge>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link to={`/jobs/${job.id}`} className="flex-1">
                    <Button className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => actions.toggleSavedJob(job.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AppShell>

      <BottomNav />
    </>
  );
}