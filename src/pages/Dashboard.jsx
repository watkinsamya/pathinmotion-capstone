import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Badge } from "../components/UI";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <AppShell title="PathinMotion">
        <Card className="bg-gradient-to-b from-pink-500/15 to-slate-900/60">
          <p className="text-white/70 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-semibold">Amya</h2>
          <p className="text-white/60 mt-2 text-sm">
            Let’s move your career forward with smarter matches.
          </p>

          <div className="mt-4 flex gap-2">
            <Badge tone="success">2 new matches</Badge>
            <Badge>Resume: Uploaded</Badge>
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

        <div className="mt-5 grid grid-cols-2 gap-4">
          <Link to="/profile">
            <Card className="hover:bg-white/5 transition">
              <p className="text-sm text-white/70">Profile</p>
              <p className="mt-1 font-semibold">Skills & Goals</p>
              <p className="mt-1 text-xs text-white/50">
                Improve match accuracy
              </p>
            </Card>
          </Link>

          <Link to="/matches">
            <Card className="hover:bg-white/5 transition">
              <p className="text-sm text-white/70">AI Matches</p>
              <p className="mt-1 font-semibold">Top Roles</p>
              <p className="mt-1 text-xs text-white/50">
                Ranked by fit
              </p>
            </Card>
          </Link>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}

