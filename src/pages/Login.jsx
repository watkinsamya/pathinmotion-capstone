import { useState } from "react";
import AppShell from "../components/AppShell";
import { Button, Card, Input, Divider } from "../components/UI";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("amya@email.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo login storage
    const existingProfile =
      JSON.parse(localStorage.getItem("pm_profile")) || {};

    const nameGuess =
      existingProfile.name ||
      email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase());

    localStorage.setItem("pm_demo_authed", "true");
    localStorage.setItem(
      "pm_profile",
      JSON.stringify({
        name: nameGuess,
        email,
        role: existingProfile.role || "Early-career Software Engineer",
        location: existingProfile.location || "Detroit, MI",
        skills: existingProfile.skills || ["React", "UI/UX", "SQL"],
      })
    );

    navigate("/dashboard");
  }

  function handleContinueDemo() {
    localStorage.setItem("pm_demo_authed", "true");
    localStorage.setItem(
      "pm_profile",
      JSON.stringify({
        name: "Amya",
        email: "demo@pathinmotion.com",
        role: "Early-career Software Engineer",
        location: "Detroit, MI",
        skills: ["React", "UI/UX", "SQL"],
      })
    );

    navigate("/dashboard");
  }

  function handleGoToRegister() {
    navigate("/register");
  }

  return (
    <AppShell title="Sign In">
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/5 bg-gradient-to-b from-[#F7D4D8]/60 to-white p-5 shadow-sm">
          <p className="text-sm text-black/50">Welcome back to</p>
          <h2 className="text-3xl font-semibold text-brand-ink mt-1">
            PathinMotion
          </h2>
          <p className="text-black/60 text-sm mt-2">
            Sign in to view your matches and keep your progress.
          </p>
        </div>

        <Card className="text-brand-ink">
          <form className="space-y-4" onSubmit={handleSignIn}>
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
                placeholder="Enter your password"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>

          <Divider className="my-4" />

          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleContinueDemo}
            >
              Continue as Demo
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoToRegister}
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
