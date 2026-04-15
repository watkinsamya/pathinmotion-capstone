import { useState } from "react";
import AppShell from "../components/AppShell";
import { Button, Card, Input } from "../components/UI";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleCreateAccount(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    localStorage.setItem("pm_demo_authed", "true");
    localStorage.setItem(
      "pm_profile",
      JSON.stringify({
        name,
        email,
        role: "Early-career Software Engineer",
        location: "Detroit, MI",
        skills: ["React", "UI/UX", "SQL"],
      })
    );

    navigate("/dashboard");
  }

  function handleGoToLogin() {
    navigate("/login");
  }

  return (
    <AppShell title="Create Account">
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/5 bg-gradient-to-b from-[#F7D4D8]/50 to-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
            Start your path
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Build your profile once. Get better matches every time.
          </p>
        </div>

        <Card className="text-brand-ink">
          <form className="space-y-3" onSubmit={handleCreateAccount}>
            <div>
              <label className="text-xs text-black/60">Full name</label>
              <Input
                placeholder="Amya Watkins"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-black/60">Email</label>
              <Input
                type="email"
                placeholder="amya@email.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-black/60">Password</label>
              <Input
                type="password"
                placeholder="Create a password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="pt-2 flex flex-col gap-3">
              <Button className="w-full" type="submit">
                Create Account
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleGoToLogin}
              >
                Sign In Instead
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-[11px] text-black/40 text-center leading-relaxed">
          By creating an account, you agree to our Terms and Privacy Policy
          (demo).
        </p>
      </div>
    </AppShell>
  );
}
