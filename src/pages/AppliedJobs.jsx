import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { useApp } from "../context/AppContext";

const STATUSES = ["Applied", "Interviewing", "Offer Received", "Rejected", "Withdrawn"];

const STATUS_COLORS = {
  Applied:        "warn",
  Interviewing:   "success",
  "Offer Received": "success",
  Rejected:       "pink",
  Withdrawn:      "pink",
};

function ExternalLink({ href, className, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function AppliedJobs() {
  const { state, actions } = useApp();

  const applications = JSON.parse(localStorage.getItem("pm_applications")) || {};
  const appList = Object.values(applications);

  const applied = appList.map((app) => ({
    ...app,
    status:
      state.appliedJobs?.find((a) => a.id === app.jobId)?.status ||
      app.status ||
      "Applied",
  }));

  return (
    <>
      <AppShell title="Applied Jobs">
        <div className="space-y-4">

          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Application Tracker</h2>
            <p className="text-sm text-black/60 mt-1">
              Track every job you applied to and update your status as you progress.
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Badge>{applied.length} total</Badge>
              <Badge tone="success">
                {applied.filter((a) => a.status === "Interviewing").length} interviewing
              </Badge>
              <Badge tone="warn">
                {applied.filter((a) => a.status === "Applied").length} pending
              </Badge>
            </div>
          </Card>

          {applied.length === 0 && (
            <Card className="text-brand-ink text-center py-6">
              <p className="text-2xl mb-2">📋</p>
              <p className="font-semibold">No applications yet</p>
              <p className="text-sm text-black/60 mt-1">
                Browse jobs and click Apply to start tracking here.
              </p>
            </Card>
          )}

          {applied.map((app) => (
            <Card key={app.jobId} className="text-brand-ink">

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{app.jobTitle}</h3>
                  <p className="text-sm text-black/60">{app.company}</p>
                  <p className="text-xs text-black/45 mt-1">{app.location}</p>
                </div>
                <Badge tone={STATUS_COLORS[app.status] || "warn"}>
                  {app.status}
                </Badge>
              </div>

              <div className="mt-2 text-xs text-black/50">
                <span>Applied: {app.submittedAt}</span>
                {app.source ? " • via " + app.source : ""}
              </div>

              {app.name && (
                <div className="mt-3 bg-black/5 rounded-xl p-3 text-xs text-black/70 space-y-1">
                  <p><strong>Name:</strong> {app.name}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  {app.phone ? (
                    <p><strong>Phone:</strong> {app.phone}</p>
                  ) : null}
                  {app.resumeLink ? (
                    <p>
                      <strong>Resume: </strong>
                      <ExternalLink
                        href={app.resumeLink}
                        className="text-blue-600 underline"
                      >
                        View
                      </ExternalLink>
                    </p>
                  ) : null}
                  {app.coverNote ? (
                    <p><strong>Note:</strong> {app.coverNote}</p>
                  ) : null}
                </div>
              )}

              <div className="mt-3">
                <label className="text-xs text-black/60 font-medium">
                  Update Status
                </label>
                <select
                  value={app.status}
                  onChange={(e) =>
                    actions.updateApplicationStatus(app.jobId, e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex gap-2">
                {app.externalUrl && app.externalUrl !== "#" ? (
                  <ExternalLink href={app.externalUrl} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs">
                      View Posting
                    </Button>
                  </ExternalLink>
                ) : null}

                <Button
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => {
                    const apps =
                      JSON.parse(localStorage.getItem("pm_applications")) || {};
                    delete apps[app.jobId];
                    localStorage.setItem(
                      "pm_applications",
                      JSON.stringify(apps)
                    );
                    actions.removeAppliedJob(app.jobId);
                    window.location.reload();
                  }}
                >
                  Remove
                </Button>
              </div>

            </Card>
          ))}

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}