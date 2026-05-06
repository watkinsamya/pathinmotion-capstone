import { useState } from "react";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider, Input } from "../components/UI";
import { useApp } from "../context/AppContext";

const CATEGORIES = [
  "All", "STEM", "Women in Tech", "Underrepresented",
  "First-Gen", "Business", "Healthcare", "Arts",
];

const SCHOLARSHIPS = [
  {
    id: "sch-1",
    name: "Women in Tech Scholars Award",
    org: "AnitaB.org",
    award: "$5,000",
    deadline: "2027-04-15",
    category: "Women in Tech",
    gpa: "3.0+",
    major: "Computer Science or related",
    eligibility: ["Women or non-binary students", "CS or related major", "GPA 3.0+"],
    description: "Supporting women and underrepresented groups in technology fields.",
    logo: "W",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "sch-2",
    name: "Underrepresented STEM Grant",
    org: "UNCF",
    award: "$2,500",
    deadline: "2027-03-30",
    category: "Underrepresented",
    gpa: "2.5+",
    major: "STEM fields",
    eligibility: ["Underrepresented minority student", "STEM major", "Financial need"],
    description: "For underrepresented students pursuing degrees in science, technology, engineering, or math.",
    logo: "U",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "sch-3",
    name: "Future Innovators Scholarship",
    org: "Tech Forward Foundation",
    award: "$1,500",
    deadline: "2027-05-10",
    category: "STEM",
    gpa: "2.8+",
    major: "Any tech-related",
    eligibility: ["Junior or Senior standing", "Tech-related major", "Essay required"],
    description: "Recognizing early-career students who demonstrate innovation and leadership potential.",
    logo: "F",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "sch-4",
    name: "Google Generation Scholarship",
    org: "Google",
    award: "$10,000",
    deadline: "2027-03-15",
    category: "Women in Tech",
    gpa: "3.0+",
    major: "Computer Science or related",
    eligibility: ["Women or non-binary", "Enrolled in CS program", "GPA 3.0+", "Leadership experience"],
    description: "Supporting women and underrepresented groups in computer science and technology.",
    logo: "G",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "sch-5",
    name: "First Generation Scholarship Fund",
    org: "College Board",
    award: "$7,500",
    deadline: "2027-02-15",
    category: "First-Gen",
    gpa: "2.5+",
    major: "Any",
    eligibility: ["First-generation college student", "Financial need", "Community involvement"],
    description: "Dedicated to first-generation college students blazing new trails for their families.",
    logo: "C",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "sch-6",
    name: "AMA Foundation Marketing Scholarship",
    org: "American Marketing Association",
    award: "$2,500",
    deadline: "2027-05-01",
    category: "Business",
    gpa: "3.0+",
    major: "Marketing or Business",
    eligibility: ["Marketing or Business major", "AMA member preferred", "Essay required"],
    description: "Supporting the next generation of marketing and business leaders.",
    logo: "A",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "sch-7",
    name: "HFMA Healthcare Scholarship",
    org: "Healthcare Financial Mgmt Association",
    award: "$5,000",
    deadline: "2027-03-30",
    category: "Healthcare",
    gpa: "3.0+",
    major: "Healthcare or Finance",
    eligibility: ["Healthcare or Finance major", "Interest in health industry", "Two references"],
    description: "For students pursuing careers at the intersection of healthcare and finance.",
    logo: "H",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "sch-8",
    name: "National Design Scholarship",
    org: "NASAD",
    award: "$3,000",
    deadline: "2027-04-20",
    category: "Arts",
    gpa: "2.8+",
    major: "Art, Design, or Architecture",
    eligibility: ["Art or Design major", "Portfolio required", "Statement of purpose"],
    description: "Supporting emerging artists and designers who show exceptional creative talent.",
    logo: "N",
    color: "bg-pink-100 text-pink-700",
  },
];

export default function Scholarships() {
  const { state, actions } = useApp();

  const [category,      setCategory]      = useState("All");
  const [search,        setSearch]        = useState("");
  const [applyTarget,   setApplyTarget]   = useState(null);
  const [applyForm,     setApplyForm]     = useState({ name: "", email: "", gpa: "", essay: "" });
  const [submitted,     setSubmitted]     = useState(() => {
    const saved = localStorage.getItem("pm_scholarship_apps");
    return saved ? Object.keys(JSON.parse(saved)) : [];
  });

  const profile = JSON.parse(localStorage.getItem("pm_profile")) || {};

  function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  }

  const filtered = SCHOLARSHIPS.filter((s) => {
    const matchCat    = category === "All" || s.category === category;
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.org.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function openApply(scholarship) {
    setApplyTarget(scholarship);
    setApplyForm({
      name:  profile.name  || "",
      email: profile.email || "",
      gpa:   "",
      essay: "",
    });
  }

  function submitApplication(e) {
    e.preventDefault();
    const apps = JSON.parse(localStorage.getItem("pm_scholarship_apps")) || {};
    apps[applyTarget.id] = {
      ...applyTarget,
      ...applyForm,
      submittedAt: new Date().toLocaleString(),
      status: "Submitted",
    };
    localStorage.setItem("pm_scholarship_apps", JSON.stringify(apps));
    setSubmitted(prev => [...prev, applyTarget.id]);
    actions.toggleSavedScholarship(applyTarget.id);
    setApplyTarget(null);
  }

  if (applyTarget) {
    return (
      <>
        <AppShell title="Apply for Scholarship">
          <div className="space-y-4">
            <Card className="text-brand-ink">
              <div className="flex items-center gap-3">
                <div className={"w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 " + applyTarget.color}>
                  {applyTarget.logo}
                </div>
                <div>
                  <h2 className="font-semibold">{applyTarget.name}</h2>
                  <p className="text-sm text-black/60">{applyTarget.org} · {applyTarget.award}</p>
                </div>
              </div>
            </Card>

            <Card className="text-brand-ink">
              <h3 className="font-semibold mb-4">Application Form</h3>
              <form className="space-y-4" onSubmit={submitApplication}>
                <div>
                  <label className="text-xs font-medium text-black/60">Full Name *</label>
                  <Input
                    value={applyForm.name}
                    onChange={(e) => setApplyForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60">Email *</label>
                  <Input
                    type="email"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60">Current GPA *</label>
                  <Input
                    value={applyForm.gpa}
                    onChange={(e) => setApplyForm(p => ({ ...p, gpa: e.target.value }))}
                    placeholder="e.g. 3.5"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-black/60">
                    Why do you deserve this scholarship? *
                  </label>
                  <textarea
                    value={applyForm.essay}
                    onChange={(e) => setApplyForm(p => ({ ...p, essay: e.target.value }))}
                    placeholder="Tell us about yourself, your goals, and why you should receive this scholarship..."
                    rows={5}
                    required
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Submit Application</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setApplyTarget(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <AppShell title="Scholarships">
        <div className="space-y-4">

          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Scholarships</h2>
            <p className="text-sm text-black/60 mt-1">
              Discover and apply to scholarships matched to your background.
            </p>
            <div className="mt-2 flex gap-2">
              <Badge tone="success">{submitted.length} applied</Badge>
              <Badge>{state.savedScholarships?.length || 0} saved</Badge>
            </div>
          </Card>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholarships..."
          />

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all " +
                  (category === cat
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-black/60 border-black/10")
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.map((s) => {
            const days        = daysUntil(s.deadline);
            const isSaved     = state.savedScholarships?.includes(s.id);
            const isSubmitted = submitted.includes(s.id);
            const isUrgent    = days <= 14 && days > 0;
            const isExpired   = days <= 0;

            return (
              <Card key={s.id} className="text-brand-ink hover:bg-black/[0.01] transition">
                <div className="flex items-start gap-3">
                  <div className={"w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 " + s.color}>
                    {s.logo}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{s.name}</h3>
                        <p className="text-xs text-black/60">{s.org}</p>
                      </div>
                      <p className="text-sm font-bold text-green-600 shrink-0">{s.award}</p>
                    </div>

                    <p className="text-xs text-black/60 mt-2 line-clamp-2">{s.description}</p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge tone="pink">{s.category}</Badge>
                      <Badge>GPA {s.gpa}</Badge>
                      {isUrgent   && <Badge tone="warn">⚡ {days} days left</Badge>}
                      {isExpired  && <Badge tone="pink">Expired</Badge>}
                      {isSubmitted && <Badge tone="success">Applied ✓</Badge>}
                    </div>

                    <p className="text-xs text-black/45 mt-2">
                      Deadline: {new Date(s.deadline).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric"
                      })}
                    </p>

                    <Divider className="my-3" />

                    <p className="text-xs font-semibold text-black/60 mb-1">Eligibility:</p>
                    {s.eligibility.slice(0, 2).map((e) => (
                      <p key={e} className="text-xs text-black/55">• {e}</p>
                    ))}

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant={isSaved ? "primary" : "secondary"}
                        className="flex-1 text-xs py-1.5"
                        onClick={() => actions.toggleSavedScholarship(s.id)}
                      >
                        {isSaved ? "Saved ✓" : "Save"}
                      </Button>

                      {!isExpired && !isSubmitted ? (
                        <Button
                          className="flex-1 text-xs py-1.5"
                          onClick={() => openApply(s)}
                        >
                          Apply Now
                        </Button>
                      ) : isSubmitted ? (
                        <Button
                          variant="secondary"
                          className="flex-1 text-xs py-1.5 text-green-600"
                          disabled
                        >
                          Submitted ✓
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          className="flex-1 text-xs py-1.5"
                          disabled
                        >
                          Expired
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}