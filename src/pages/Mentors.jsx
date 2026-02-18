import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";

const mentors = [
  { name: "Jordan Lee", role: "Senior Frontend Engineer", industry: "FinTech", years: 7, fit: 88 },
  { name: "Aisha Carter", role: "Product Designer", industry: "Healthcare", years: 6, fit: 82 },
  { name: "Marcus Hill", role: "QA Automation Engineer", industry: "Automotive", years: 8, fit: 76 },
];

function initials(name) {
  return name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
}

export default function Mentors() {
  return (
    <>
      <AppShell title="Mentor Matches">
        <div className="space-y-4">
          {mentors.map((m) => (
            <Card key={m.name} className="hover:bg-white/5 transition">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-semibold">
                  {initials(m.name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{m.name}</h3>
                      <p className="text-white/60 text-sm">{m.role}</p>
                      <p className="text-white/45 text-xs mt-1">
                        {m.industry} • {m.years} yrs experience
                      </p>
                    </div>

                    <Badge tone="success">{m.fit}% Fit</Badge>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button className="flex-1">View Profile</Button>
                    <Button variant="secondary" className="flex-1">
                      Request Mentorship
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
