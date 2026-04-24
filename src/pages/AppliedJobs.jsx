import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { jobs } from "../data/jobs";
import { useApp } from "../context/AppContext";

const statuses = ["Applied", "Interviewing", "Rejected", "Offer"];

export default function AppliedJobs() {
  const { state, actions } = useApp();

  const applied = state.appliedJobs
    .map((app) => ({
      ...app,
      job: jobs.find((job) => job.id === app.id),
    }))
    .filter((app) => app.job);

  return (
    <>
      <AppShell title="Applied Jobs">
        <div className="space-y-4">
          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Application Tracker</h2>
            <p className="text-sm text-black/60 mt-1">
              Track jobs you applied to and update your application status.
            </p>
            <Badge className="mt-3">{applied.length} applications</Badge>
          </Card>

          {applied.length === 0 && (
            <Card className="text-brand-ink">
              <p className="text-sm text-black/60">
                No applied jobs yet. Go to Browse Jobs and apply to a role.
              </p>
            </Card>
          )}

          {applied.map((app) => (
            <Card key={app.id} className="text-brand-ink">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{app.job.title}</h3>
                  <p className="text-sm text-black/60">{app.job.company}</p>
                  <p className="text-xs text-black/45 mt-1">
                    Applied on {app.appliedDate}
                  </p>
                </div>

                <Badge tone="success">{app.status}</Badge>
              </div>

              <div className="mt-4">
                <label className="text-xs text-black/60">Update Status</label>
                <select
                  value={app.status}
                  onChange={(e) =>
                    actions.updateApplicationStatus(app.id, e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => actions.removeAppliedJob(app.id)}
              >
                Remove from Tracker
              </Button>
            </Card>
          ))}
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}