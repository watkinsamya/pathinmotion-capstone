import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Input, Divider, Badge } from "../components/UI";
import { jobs as FALLBACK_JOBS } from "../data/jobs";
import { useApp } from "../context/AppContext";

function ExternalLink({ href, className, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function ApplyJob() {
  const { id }             = useParams();
  const location           = useLocation();
  const navigate           = useNavigate();
  const { state, actions } = useApp();

  const jobFromState = location.state?.job;

  const job = useMemo(() => {
    return jobFromState || FALLBACK_JOBS.find((j) => j.id === id);
  }, [id, jobFromState]);

  const profile = JSON.parse(localStorage.getItem("pm_profile")) || {};

  const [form, setForm] = useState({
    name:       profile.name  || state.user?.name  || "",
    email:      profile.email || state.user?.email || "",
    phone:      "",
    resumeLink: "",
    coverNote:  "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <>
        <AppShell title="Apply">
          <Card className="text-brand-ink">
            <p className="text-2xl mb-2">🔍</p>
            <h2 className="font-semibold">Job not found</h2>
            <p className="text-sm text-black/60 mt-1">
              This job may have expired or been removed.
            </p>
            <Button className="mt-4 w-full" onClick={() => navigate("/jobs")}>
              Back to Jobs
            </Button>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  const alreadyApplied = state.appliedJobs?.some((a) => a.id === id);

  if (alreadyApplied) {
    return (
      <>
        <AppShell title="Already Applied">
          <Card className="text-brand-ink text-center py-8">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-semibold">Already Applied</h2>
            <p className="text-sm text-black/60 mt-2">
              You already applied for <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong>.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                onClick={() => navigate("/applied-jobs")}
                className="w-full"
              >
                View My Applications
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/jobs")}
                className="w-full"
              >
                Browse More Jobs
              </Button>
            </div>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <AppShell title="Submitted">
          <Card className="text-brand-ink text-center py-8">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-xl font-semibold">Application Submitted!</h2>
            <p className="text-sm text-black/60 mt-2">
              Your application for <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong> has been saved to your tracker.
            </p>
            <p className="text-xs text-black/45 mt-4">
              Redirecting to your tracker...
            </p>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const jobKey = job.id || id;

    const applications =
      JSON.parse(localStorage.getItem("pm_applications")) || {};

    applications[jobKey] = {
      jobId:       jobKey,
      jobTitle:    job.title    || "Unknown Title",
      company:     job.company  || "Unknown Company",
      location:    job.location || "",
      salary:      job.salary   || "Salary not listed",
      source:      job.source   || "Path in Motion",
      externalUrl: job.url      || "",
      status:      "Applied",
      submittedAt: new Date().toLocaleString(),
      name:        form.name,
      email:       form.email,
      phone:       form.phone,
      resumeLink:  form.resumeLink,
      coverNote:   form.coverNote,
    };

    localStorage.setItem("pm_applications", JSON.stringify(applications));
    actions.applyToJob(jobKey);
    setSubmitted(true);
    setTimeout(() => navigate("/applied-jobs"), 1800);
  }

  return (
    <>
      <AppShell title="Apply">
        <div className="space-y-4">

          <Card className="text-brand-ink">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold leading-tight">
                  {job.title}
                </h2>
                <p className="text-sm text-black/60 mt-1">{job.company}</p>
                <p className="text-xs text-black/45 mt-1">
                  {job.location}
                  {job.salary && job.salary !== "Salary not listed"
                    ? " • " + job.salary
                    : ""}
                </p>
              </div>
              <Badge tone="success">{job.source || "Live"}</Badge>
            </div>

            {job.remote === true && (
              <div className="mt-2">
                <Badge tone="success">Remote</Badge>
              </div>
            )}

            {job.url && job.url !== "#" && (
              <ExternalLink href={job.url} className="mt-3 block">
                <Button variant="secondary" className="w-full text-xs">
                  View Original Posting
                </Button>
              </ExternalLink>
            )}
          </Card>

          <Card className="text-brand-ink">
            <h3 className="font-semibold text-base">Your Information</h3>
            <p className="text-xs text-black/50 mt-1">
              Saved to your tracker — not sent to the employer directly.
            </p>

            <Divider className="my-4" />

            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label className="text-xs font-medium text-black/60">
                  Full Name *
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black/60">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black/60">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 555-5555"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-black/60">
                  Resume Link
                </label>
                <Input
                  name="resumeLink"
                  value={form.resumeLink}
                  onChange={handleChange}
                  placeholder="Google Drive, LinkedIn, or portfolio URL"
                  className="mt-1"
                />
                {state.resumeUploaded && (
                  <p className="text-xs text-green-600 mt-1">
                    Resume analyzed — paste the link to share with employers.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-black/60">
                  Why are you interested? (optional)
                </label>
                <textarea
                  name="coverNote"
                  value={form.coverNote}
                  onChange={handleChange}
                  placeholder="Tell us why you are a great fit..."
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50 resize-none"
                />
              </div>

              {state.extractedSkills && state.extractedSkills.length > 0 && (
                <div className="bg-[#FFF7EF] rounded-xl p-3">
                  <p className="text-xs font-medium text-black/60 mb-2">
                    Your skills from resume:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {state.extractedSkills.slice(0, 8).map((skill) => (
                      <Badge key={skill} tone="warn">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit Application
              </Button>

            </form>
          </Card>

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}