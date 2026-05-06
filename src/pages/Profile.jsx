import { useState } from "react";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Input, Divider } from "../components/UI";
import { useApp } from "../context/AppContext";

const INDUSTRIES = [
  "Software Engineering", "Data Science", "UX Design", "Product Management",
  "Marketing", "Finance", "Healthcare", "Education", "Cybersecurity", "Business", "Other",
];

const CAREER_GOALS = [
  "Land my first job", "Switch careers", "Get promoted", "Find a mentor",
  "Improve my resume", "Learn new skills", "Build my network", "Start a business",
];

export default function Profile() {
  const { state } = useApp();

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const [form, setForm] = useState(() => {
    const p = JSON.parse(localStorage.getItem("pm_profile")) || {};
    return {
      name:      p.name      || "Amya Watkins",
      email:     p.email     || "amya@email.com",
      phone:     p.phone     || "",
      location:  p.location  || "Atlanta, GA",
      school:    p.school    || "",
      major:     p.major     || "",
      gradYear:  p.gradYear  || "",
      industry:  p.industry  || "Software Engineering",
      goalRole:  p.goalRole  || "Software Engineer",
      goals:     p.goals     || [],
      bio:       p.bio       || "",
      linkedin:  p.linkedin  || "",
      github:    p.github    || "",
      portfolio: p.portfolio || "",
    };
  });

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleGoal(goal) {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  }

  function handleSave() {
    localStorage.setItem("pm_profile", JSON.stringify(form));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const appliedCount     = Object.keys(JSON.parse(localStorage.getItem("pm_applications")      || "{}")).length;
  const scholarshipCount = Object.keys(JSON.parse(localStorage.getItem("pm_scholarship_apps")  || "{}")).length;
  const sessionCount     = Object.keys(JSON.parse(localStorage.getItem("pm_sessions")          || "{}")).length;

  return (
    <>
      <AppShell title="Profile & Settings">
        <div className="space-y-4">

          {/* Header */}
          <Card className="bg-gradient-to-br from-[#F3B055]/25 via-[#F7D4D8]/30 to-white text-brand-ink">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-ink flex items-center justify-center text-white font-bold text-xl shrink-0">
                {form.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{form.name}</h2>
                <p className="text-sm text-black/60">{form.goalRole}</p>
                <p className="text-xs text-black/45 mt-1">{form.email} · {form.location}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Applied",      val: appliedCount     },
                { label: "Scholarships", val: scholarshipCount },
                { label: "Sessions",     val: sessionCount     },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/60 border border-black/5 p-3 text-center">
                  <p className="text-lg font-bold">{item.val}</p>
                  <p className="text-xs text-black/50">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
              {editing && (
                <Button variant="secondary" className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
            </div>

            {saved && (
              <p className="text-xs text-green-600 text-center mt-2">
                Profile saved successfully!
              </p>
            )}
          </Card>

          {/* Personal Info */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              {[
                { label: "Full Name",  field: "name",     type: "text",  placeholder: "Your full name"    },
                { label: "Email",      field: "email",    type: "email", placeholder: "your@email.com"    },
                { label: "Phone",      field: "phone",    type: "text",  placeholder: "(555) 555-5555"    },
                { label: "Location",   field: "location", type: "text",  placeholder: "City, State"       },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-xs font-medium text-black/60">{f.label}</label>
                  <Input
                    type={f.type}
                    value={form[f.field]}
                    onChange={(e) => handleChange(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-black/60">Short Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  disabled={!editing}
                  placeholder="Tell mentors and employers about yourself..."
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50 resize-none disabled:opacity-60"
                />
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold mb-4">Education</h3>
            <div className="space-y-3">
              {[
                { label: "School / University", field: "school",   placeholder: "e.g. Georgia State University" },
                { label: "Major",               field: "major",    placeholder: "e.g. Computer Science"        },
                { label: "Graduation Year",      field: "gradYear", placeholder: "e.g. 2026"                   },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-xs font-medium text-black/60">{f.label}</label>
                  <Input
                    value={form[f.field]}
                    onChange={(e) => handleChange(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Career Focus */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold mb-3">Career Focus</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-black/60">Target Industry</label>
                {editing ? (
                  <select
                    value={form.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                  >
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-black/70">{form.industry}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-black/60">Target Role</label>
                <Input
                  value={form.goalRole}
                  onChange={(e) => handleChange("goalRole", e.target.value)}
                  placeholder="e.g. Software Engineer"
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
            </div>

            <Divider className="my-3" />

            <p className="text-xs font-medium text-black/60 mb-2">Career Goals</p>
            <div className="flex flex-wrap gap-2">
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal}
                  disabled={!editing}
                  onClick={() => toggleGoal(goal)}
                  className={
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all " +
                    (form.goals.includes(goal)
                      ? "bg-brand-ink text-white border-brand-ink"
                      : "bg-white text-black/60 border-black/10") +
                    (editing ? " cursor-pointer" : " cursor-default opacity-80")
                  }
                >
                  {goal}
                </button>
              ))}
            </div>

            {state.extractedSkills?.length > 0 && (
              <>
                <Divider className="my-3" />
                <p className="text-xs font-medium text-black/60 mb-2">Skills from Resume</p>
                <div className="flex flex-wrap gap-2">
                  {state.extractedSkills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Links */}
          <Card className="text-brand-ink">
            <h3 className="font-semibold mb-4">Links & Portfolio</h3>
            <div className="space-y-3">
              {[
                { label: "LinkedIn",   field: "linkedin",  placeholder: "linkedin.com/in/yourname" },
                { label: "GitHub",     field: "github",    placeholder: "github.com/yourname"      },
                { label: "Portfolio",  field: "portfolio", placeholder: "yourportfolio.com"        },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-xs font-medium text-black/60">{f.label}</label>
                  <Input
                    value={form[f.field]}
                    onChange={(e) => handleChange(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </Card>

          {editing && (
            <Button className="w-full" onClick={handleSave}>
              Save All Changes
            </Button>
          )}

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}