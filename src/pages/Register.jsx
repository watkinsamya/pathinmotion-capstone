import AppShell from "../components/AppShell";
import { Button, Card, Input } from "../components/UI";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  function handleCreateAccount(e) {
    e.preventDefault();

    localStorage.setItem("pm_demo_authed", "true");
    localStorage.setItem(
      "pm_profile",
      JSON.stringify({
        name: "Amya",
        role: "Early-career Software Engineer",
        location: "Detroit, MI",
        skills: ["React", "UI/UX", "SQL"],
      })
    );
    navigate("/dashboard");
  }

  return (
    <AppShell title="Create Account">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-slate-900/60 p-5">
          <h2 className="text-2xl font-semibold tracking-tight">Start your path</h2>
          <p className="text-white/55 text-sm mt-1">
            Build your profile once. Get better matches every time.
          </p>
        </div>

        <Card>
          <form className="space-y-3" onSubmit={handleCreateAccount}>
            <div>
              <label className="text-xs text-white/60">Full name</label>
              <Input placeholder="Amya Watkins" className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-white/60">Email</label>
              <Input placeholder="amya@email.com" className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-white/60">Password</label>
              <Input type="password" placeholder="Create a password" className="mt-1" />
            </div>

            <Button className="w-full" type="submit">
              Create Account
            </Button>

            <p className="text-xs text-white/50 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-300 hover:text-pink-200">
                Sign in
              </Link>
            </p>
          </form>
        </Card>

        <p className="text-[11px] text-white/40 text-center leading-relaxed">
          By creating an account, you agree to our Terms and Privacy Policy (demo).
        </p>
      </div>
    </AppShell>
  );
}
