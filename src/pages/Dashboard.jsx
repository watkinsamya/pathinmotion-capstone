import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Badge } from "../components/UI";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { state } = useApp();

  const name = state.user?.name || "Amya";
  const savedMatchesCount = state.savedMatches?.length || 0;
  const savedJobsCount = state.savedJobs?.length || 0;
  const savedScholarshipsCount = state.savedScholarships?.length || 0;

  return (
    <>
      <AppShell title="Dashboard">
        {/* Hero */}
        <Card className="bg-gradient-to-br from-[#F3B055]/25 via-[#F7D4D8]/25 to-white text-brand-ink">
          <p className="text-black/60 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-black/60 mt-2 text-sm">
            Discover jobs, mentors & scholarships — plus AI-powered matches.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="pink">{savedMatchesCount} saved matches</Badge>
            <Badge tone="warn">{savedJobsCount} saved jobs</Badge>
            <Badge tone="success">{savedScholarshipsCount} saved scholarships</Badge>
            <Badge>Profile: 60%</Badge>
          </div>

          <div className="mt-5 flex gap-3">
            <Link to="/matches" className="flex-1">
              <Button className="w-full">AI Matches</Button>
            </Link>
            <Link to="/jobs" className="flex-1">
              <Button variant="secondary" className="w-full">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </Card>

        {/* Progress */}
        <Card className="mt-5 text-brand-ink">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Progress</h3>
            <Badge>This week</Badge>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-black/60">
              <span>Profile Completion</span>
              <span>60%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/5 overflow-hidden">
              <div className="h-full w-[60%] bg-[#F4863E]" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                <p className="text-xs text-black/50">Saved Jobs</p>
                <p className="font-semibold mt-1">{savedJobsCount}</p>
              </div>
              <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                <p className="text-xs text-black/50">Saved Matches</p>
                <p className="font-semibold mt-1">{savedMatchesCount}</p>
              </div>
              <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                <p className="text-xs text-black/50">Scholarships</p>
                <p className="font-semibold mt-1">{savedScholarshipsCount}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Link to="/matches">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">AI Job Matches</p>
                <Badge tone="success">New</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Jobs ranked by fit</p>
              <p className="mt-2 text-xs text-black/45">View Matches →</p>
            </Card>
          </Link>

          <Link to="/jobs">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Browse Jobs</p>
                <Badge tone="warn">Explore</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Discover opportunities</p>
              <p className="mt-2 text-xs text-black/45">Open Jobs →</p>
            </Card>
          </Link>

          <Link to="/saved-jobs">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Saved Jobs</p>
                <Badge tone="warn">{savedJobsCount}</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Your shortlist</p>
              <p className="mt-2 text-xs text-black/45">View Saved →</p>
            </Card>
          </Link>

          <Link to="/scholarships">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Scholarships</p>
                <Badge>{savedScholarshipsCount} saved</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Deadlines + awards</p>
              <p className="mt-2 text-xs text-black/45">Explore →</p>
            </Card>
          </Link>

          <Link to="/mentors">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Mentors</p>
                <Badge tone="pink">Best Fit</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Connect with experts</p>
              <p className="mt-2 text-xs text-black/45">Browse →</p>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover:shadow-md transition text-brand-ink">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Profile & Skills</p>
                <Badge>Quick Edit</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">Improve match accuracy</p>
              <p className="mt-2 text-xs text-black/45">Edit Profile →</p>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <Card className="mt-5 text-brand-ink">
          <h3 className="font-semibold">Quick Actions</h3>
          <p className="text-sm text-black/60 mt-1">
            Keep your profile fresh to improve future match quality.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/resume">
              <Button className="w-full">Upload Resume</Button>
            </Link>
            <Link to="/profile">
              <Button variant="secondary" className="w-full">
                Update Skills
              </Button>
            </Link>
          </div>
        </Card>
      </AppShell>

      <BottomNav />
    </>
  );
}