import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button } from "../components/UI";
import { jobs } from "../data/jobs";
import { useApp } from "../context/AppContext";

export default function Recommendations() {
  const { state, actions } = useApp();

  const skills = state.extractedSkills || [];

  const recommended = jobs
    .map((job) => {
      const matchCount = job.tags.filter((tag) =>
        skills.some((skill) => skill.toLowerCase() === tag.toLowerCase())
      ).length;

      const score = Math.min(95, 65 + matchCount * 10);

      return { ...job, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <AppShell title="Recommendations">
        <div className="space-y-4">
          <Card className="text-brand-ink">
            <h2 className="text-xl font-semibold">Recommended Jobs</h2>
            <p className="text-sm text-black/60 mt-1">
              Suggestions based on your resume skills and profile.
            </p>
          </Card>

          {recommended.map((job) => {
            const isApplied = state.appliedJobs.some((app) => app.id === job.id);

            return (
              <Card key={job.id} className="text-brand-ink">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-black/60">{job.company}</p>
                    <p className="text-xs text-black/45 mt-1">
                      {job.location} • {job.salary}
                    </p>
                  </div>

                  <Badge tone="success">{job.score}% Match</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} tone="pink">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => actions.applyToJob(job.id)}
                  disabled={isApplied}
                >
                  {isApplied ? "Already Applied" : "Apply"}
                </Button>
              </Card>
            );
          })}
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}