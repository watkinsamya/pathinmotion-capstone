import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button, Badge } from "../components/UI";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { state } = useApp();
  const profile = JSON.parse(localStorage.getItem("pm_profile")) || {};

  const userName = profile.name || state.user?.name || "Amya";
  const userEmail = profile.email || state.user?.email || "demo@pathinmotion.com";
  const userRole = profile.role || "Early-career Software Engineer";
  const userLocation = profile.location || "Detroit, MI";

  return (
    <>
      <AppShell title="Dashboard">
        <div className="space-y-5">
          <Card className="bg-gradient-to-br from-[#F3B055]/25 via-[#F7D4D8]/30 to-white text-brand-ink">
            <p className="text-black/60 text-sm">Welcome back,</p>
            <h2 className="text-2xl font-semibold mt-1">{userName}</h2>
            <p className="text-sm text-black/65 mt-2">{userRole}</p>
            <p className="text-xs text-black/45 mt-1">
              {userEmail} • {userLocation}
            </p>

            <p className="text-black/60 mt-4 text-sm">
              Discover jobs, mentors, and scholarships with AI-powered matching.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="warn">{state.savedJobs?.length || 0} saved jobs</Badge>
              <Badge tone="pink">{state.savedMatches?.length || 0} saved matches</Badge>
              <Badge tone="success">
                {state.savedScholarships?.length || 0} saved scholarships
              </Badge>
              <Badge>
                {state.resumeUploaded
                  ? `Resume: ${state.extractedSkills?.length || 0} skills`
                  : "Resume: Not analyzed"}
              </Badge>
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

          <Card className="text-brand-ink">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Progress</h3>
              <Badge tone="pink">This sprint</Badge>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-black/60">
                <span>Profile Completion</span>
                <span>70%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full w-[70%] bg-[#F4863E]" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                  <p className="text-xs text-black/50">Profile</p>
                  <p className="font-semibold mt-1">70%</p>
                </div>

                <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                  <p className="text-xs text-black/50">Saved Jobs</p>
                  <p className="font-semibold mt-1">{state.savedJobs?.length || 0}</p>
                </div>

                <div className="rounded-2xl bg-[#FFF7EF] border border-black/5 p-3">
                  <p className="text-xs text-black/50">Resume Skills</p>
                  <p className="font-semibold mt-1">{state.extractedSkills?.length || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/matches">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">AI Job Matches</p>
                  <Badge tone="success">Live</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Personalized job suggestions based on your resume.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  Explore your top matches →
                </p>
              </Card>
            </Link>

            <Link to="/jobs">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Browse Jobs</p>
                  <Badge>Explore</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Explore available roles and save opportunities for later.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  View job listings →
                </p>
              </Card>
            </Link>

            <Link to="/resume">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Resume Analysis</p>
                  <Badge tone="pink">AI</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Upload or paste your resume to extract skills and improve matches.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  Analyze resume →
                </p>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Profile & Skills</p>
                  <Badge>Update</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Keep your profile current to improve recommendations.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  Edit profile →
                </p>
              </Card>
            </Link>

            <Link to="/mentors">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Find Mentors</p>
                  <Badge tone="success">New</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Connect with mentors in your desired career field.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  Explore mentors →
                </p>
              </Card>
            </Link>

            <Link to="/scholarships">
              <Card className="hover:shadow-md transition text-brand-ink h-full">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Scholarships</p>
                  <Badge tone="pink">AI</Badge>
                </div>
                <p className="mt-2 text-sm text-black/60">
                  Discover scholarships matched to your profile.
                </p>
                <p className="mt-3 text-xs text-black/45">
                  View scholarships →
                </p>
              </Card>
            </Link>
          </div>

          <Card className="text-brand-ink">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Quick Summary</h3>
              <Button variant="secondary" className="text-xs px-3 py-1">
                Refresh
              </Button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-black/65">
              <p>
                Your account is set up and ready to receive personalized opportunity
                matches.
              </p>
              <p>
                {state.resumeUploaded
                  ? "Your resume has been analyzed and your AI match experience is active."
                  : "Upload or paste your resume to activate AI-powered matching."}
              </p>
              <p>
                You currently have <strong>{state.savedJobs?.length || 0}</strong> saved
                jobs, <strong>{state.savedMatches?.length || 0}</strong> saved matches,
                and <strong>{state.savedScholarships?.length || 0}</strong> saved
                scholarships.
              </p>
            </div>
          </Card>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
