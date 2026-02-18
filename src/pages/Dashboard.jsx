import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Badge } from "../components/UI";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { state } = useApp();

  return (
    <>
      <AppShell title="Dashboard">
        {/* Hero */}
        <Card className="bg-gradient-to-br from-[#F3B055]/25 via-[#F7D4D8]/25 to-white">
          <p className="text-black/60 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-semibold">{state.user?.name || "Amya"}</h2>
          <p className="text-black/60 mt-2 text-sm">
            Discover jobs, mentors & scholarships with AI-powered matches.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="warning">{state.savedMatches.length} saved matches</Badge>
            <Badge tone="success">{state.savedScholarships.length} saved scholarships</Badge>
            <Badge>Profile: 60%</Badge>
          </div>

          <div className="mt-5 flex gap-3">
            <Link to="/matches" className="flex-1">
              <Button className="w-full">View Matches</Button>
            </Link>
            <Link to="/resume" className="flex-1">
              <Button variant="secondary" className="w-full">
                Resume
              </Button>
            </Link>
          </div>
        </Card>

        {/* Progress */}
        <Card className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Your Progress</h3>
            <Badge> This week </Badge>
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
                <p className="text-xs text-black/50">Profile</p>
                <p className="font-semibold mt-1">60%</p>
              </div>
              <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                <p className="text-xs text-black/50">Applications</p>
                <p className="font-semibold mt-1">2 / 5</p>
              </div>
              <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                <p className="text-xs text-black/50">Mentors</p>
                <p className="font-semibold mt-1">1 / 3</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Link to="/matches">
            <Card className="hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <p className="font-semibold">AI Job Matches</p>
                <Badge tone="success">New</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">
                Jobs ranked by fit
              </p>
              <p className="mt-2 text-xs text-black/45">View Matches →</p>
            </Card>
          </Link>

          <Link to="/mentors">
            <Card className="hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Find a Mentor</p>
                <Badge tone="warning">Best Fit</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">
                Connect with experts
              </p>
              <p className="mt-2 text-xs text-black/45">Browse Mentors →</p>
            </Card>
          </Link>

          <Link to="/scholarships">
            <Card className="hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Discover Scholarships</p>
                <Badge>Save</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">
                Deadlines + awards
              </p>
              <p className="mt-2 text-xs text-black/45">Explore →</p>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Profile & Skills</p>
                <Badge>Quick Edit</Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">
                Improve match accuracy
              </p>
              <p className="mt-2 text-xs text-black/45">Edit Profile →</p>
            </Card>
          </Link>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
