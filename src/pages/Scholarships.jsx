import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { useApp } from "../context/AppContext";

const scholarships = [
  {
    id: "sch-1",
    name: "Women in Tech Scholars Award",
    award: "$5,000",
    deadline: "Apr 15",
    eligibility: "Women pursuing CS/SE",
    tags: ["Women in Tech", "STEM"],
  },
  {
    id: "sch-2",
    name: "Underrepresented STEM Grant",
    award: "$2,500",
    deadline: "Mar 30",
    eligibility: "Underrepresented students in STEM",
    tags: ["Underrepresented Students", "STEM"],
  },
  {
    id: "sch-3",
    name: "Future Innovators Scholarship",
    award: "$1,500",
    deadline: "May 10",
    eligibility: "Early-career / juniors/seniors",
    tags: ["Career Growth", "Tech"],
  },
];

export default function Scholarships() {
  const { state, actions } = useApp();

  return (
    <>
      <AppShell title="Scholarships">
        <div className="space-y-4">
          {scholarships.map((s) => {
            const isSaved = state.savedScholarships.includes(s.id);

            return (
              <Card key={s.id} className="hover:bg-black/[0.02] transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-black/90">{s.name}</h3>
                    <p className="text-black/60 text-sm mt-1">{s.eligibility}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>

                    <p className="text-black/45 text-xs mt-3">
                      Deadline: <span className="text-black/70">{s.deadline}</span> • Award:{" "}
                      <span className="text-black/70">{s.award}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    className="flex-1"
                    variant={isSaved ? "primary" : "secondary"}
                    onClick={() => actions.toggleSavedScholarship(s.id)}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => alert("Demo: Application link flow coming next sprint!")}
                  >
                    Apply
                  </Button>
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
