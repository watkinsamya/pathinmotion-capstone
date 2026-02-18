import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";

const jobs = [
  { title: "Frontend Developer Intern", company: "Detroit Tech Co", meta: "Remote • $25/hr", score: 86 },
  { title: "UI/UX Designer", company: "Creative Studio", meta: "Hybrid • $70k", score: 79 },
  { title: "Software QA Engineer", company: "AutoTech", meta: "On-site • $78k", score: 74 },
];

export default function Matches() {
  return (
    <>
      <AppShell title="Matches">
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.title} className="hover:bg-white/5 transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-white/60 text-sm">{job.company}</p>
                  <p className="text-white/45 text-xs mt-1">{job.meta}</p>
                </div>

                <Badge tone="success">{job.score}%</Badge>
              </div>

              <div className="mt-4 flex gap-3">
                <Button className="flex-1">View</Button>
                <Button variant="secondary" className="flex-1">Save</Button>
              </div>
            </Card>
          ))}
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
