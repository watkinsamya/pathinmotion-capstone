import AppShell from "../components/AppShell";
import { Button, Card, Divider, Input } from "../components/UI";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleDemoLogin() {
    // demo-only
    localStorage.setItem("pm_demo_authed", "true");
    navigate("/dashboard");
  }

  return (
    <AppShell title="Sign In">
      <div className="space-y-4">
        {/* Hero */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-pink-500/20 to-slate-900/60 p-5">
          <p className="text-white/70 text-sm">Welcome back to</p>
          <h2 className="text-2xl font-semibold tracking-tight">PathinMotion</h2>
          <p className="text-white/55 text-sm mt-1">
            Sign in to view your matches and keep your progress.
          </p>
        </div>

        {/* Form */}
        <Card>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/60">Email</label>
              <Input placeholder="amya@email.com" className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-white/60">Password</label>
              <Input type="password" placeholder="••••••••" className="mt-1" />
            </div>

            <Button className="w-full">Sign In</Button>

            <button className="w-full text-xs text-white/60 hover:text-white transition">
              Forgot password?
            </button>

            <Divider />

            <Button variant="secondary" className="w-full" onClick={handleDemoLogin}>
              Continue as Demo
            </Button>

            <p className="text-xs text-white/50 text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-pink-300 hover:text-pink-200">
                Create one
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-[11px] text-white/40 text-center leading-relaxed">
          Demo mode is for showcasing your product flow. Real authentication comes next.
        </p>
      </div>
    </AppShell>
  );
}
