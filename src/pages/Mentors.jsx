import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Input } from "../components/UI";

const INDUSTRIES = [
  "All", "Software Engineering", "Data Science", "UX Design",
  "Product Management", "Marketing", "Finance", "Healthcare",
  "Cybersecurity", "Business",
];

const MENTORS = [
  {
    id: "m1",
    name: "Jordan Lee",
    role: "Senior Software Engineer",
    company: "Google",
    industry: "Software Engineering",
    years: 8,
    fit: 92,
    skills: ["React", "Python", "System Design", "Algorithms"],
    bio: "Passionate about helping early-career engineers break into top tech companies. I went from a bootcamp to Google in 2 years.",
    availability: "Weekends",
    sessions: 47,
    rating: 4.9,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "m2",
    name: "Priya Sharma",
    role: "Data Science Manager",
    company: "Netflix",
    industry: "Data Science",
    years: 10,
    fit: 85,
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    bio: "I help aspiring data scientists build portfolios and land their first DS roles.",
    availability: "Weekday evenings",
    sessions: 63,
    rating: 5.0,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "m3",
    name: "Marcus Webb",
    role: "UX Lead",
    company: "Airbnb",
    industry: "UX Design",
    years: 6,
    fit: 78,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    bio: "Transitioned from graphic design to UX. I mentor designers who want to move into product-focused roles.",
    availability: "Flexible",
    sessions: 31,
    rating: 4.8,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "m4",
    name: "Aisha Johnson",
    role: "Product Manager",
    company: "Spotify",
    industry: "Product Management",
    years: 7,
    fit: 80,
    skills: ["Roadmapping", "User Stories", "Agile", "Analytics"],
    bio: "Former engineer turned PM. I coach people on making the transition and building the skills recruiters look for.",
    availability: "Saturdays",
    sessions: 52,
    rating: 4.9,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "m5",
    name: "Carlos Rivera",
    role: "Cybersecurity Analyst",
    company: "Microsoft",
    industry: "Cybersecurity",
    years: 9,
    fit: 74,
    skills: ["Penetration Testing", "SIEM", "Cloud Security", "CompTIA"],
    bio: "I help people get into cybersecurity from non-traditional backgrounds.",
    availability: "Weekday evenings",
    sessions: 28,
    rating: 4.7,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "m6",
    name: "Taylor Kim",
    role: "Marketing Director",
    company: "HubSpot",
    industry: "Marketing",
    years: 11,
    fit: 70,
    skills: ["SEO", "Content Strategy", "Growth Marketing", "Analytics"],
    bio: "I mentor marketers on building personal brands and landing leadership roles.",
    availability: "Mornings",
    sessions: 39,
    rating: 4.8,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "m7",
    name: "Dr. Rachel Chen",
    role: "Healthcare Data Analyst",
    company: "Mayo Clinic",
    industry: "Healthcare",
    years: 12,
    fit: 72,
    skills: ["Health Informatics", "R", "Clinical Data", "HIPAA"],
    bio: "Bridging healthcare and technology. I mentor professionals looking to enter health tech.",
    availability: "Flexible",
    sessions: 22,
    rating: 5.0,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "m8",
    name: "Devon Brooks",
    role: "Finance Analyst",
    company: "Goldman Sachs",
    industry: "Finance",
    years: 5,
    fit: 68,
    skills: ["Excel", "Financial Modeling", "Bloomberg", "Valuation"],
    bio: "First-gen professional who broke into finance without a target school.",
    availability: "Weekends",
    sessions: 18,
    rating: 4.6,
    color: "bg-indigo-100 text-indigo-700",
  },
];

function initials(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Mentors() {
  const navigate             = useNavigate();
  const [industry, setIndustry] = useState("All");
  const [search,   setSearch]   = useState("");

  const filtered = MENTORS.filter((m) => {
    const matchIndustry = industry === "All" || m.industry === industry;
    const matchSearch   = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchIndustry && matchSearch;
  });

  return (
    <>
      <AppShell title="Find Mentors">
        <div className="space-y-4">

          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Find a Mentor</h2>
            <p className="text-sm text-black/60 mt-1">
              Connect with professionals across industries who can guide your career.
            </p>
          </Card>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill, or role..."
          />

          <div className="flex gap-2 overflow-x-auto pb-1">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all " +
                  (industry === ind
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-black/60 border-black/10")
                }
              >
                {ind}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="text-brand-ink text-center py-8">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-semibold">No mentors found</p>
              <p className="text-sm text-black/60 mt-1">Try a different search or filter.</p>
            </Card>
          )}

          {filtered.map((m) => (
            <Card key={m.id} className="text-brand-ink hover:bg-black/[0.01] transition">
              <div className="flex items-start gap-3">

                <div className={"h-12 w-12 rounded-2xl flex items-center justify-center font-semibold shrink-0 " + m.color}>
                  {initials(m.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{m.name}</h3>
                      <p className="text-sm text-black/60">{m.role}</p>
                      <p className="text-xs text-black/45 mt-1">
                        {m.company} · {m.years} yrs · {m.industry}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge tone="success">{m.fit}% Fit</Badge>
                      <p className="text-xs text-black/40 mt-1">⭐ {m.rating}</p>
                    </div>
                  </div>

                  <p className="text-xs text-black/60 mt-2 line-clamp-2">{m.bio}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.skills.slice(0, 3).map((s) => (
                      <Badge key={s} tone="pink">{s}</Badge>
                    ))}
                  </div>

                  <p className="text-xs text-black/40 mt-2">
                    Available: {m.availability} · {m.sessions} sessions
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Button
                      className="flex-1 text-xs py-1.5"
                      onClick={() => navigate("/mentors/" + m.id, { state: { mentor: m } })}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 text-xs py-1.5"
                      onClick={() => navigate("/mentors/" + m.id + "/message", { state: { mentor: m } })}
                    >
                      Message
                    </Button>
                  </div>
                </div>

              </div>
            </Card>
          ))}

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}