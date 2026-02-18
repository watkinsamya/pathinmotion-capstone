import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Input, Button, Badge } from "../components/UI";

export default function Profile() {
  return (
    <>
      <AppShell title="Profile">
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Your Profile</h3>
            <p className="text-sm text-white/60 mt-1">
              Keep this updated so your matches improve.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-white/60">Name</label>
                <Input className="mt-1" placeholder="Amya Watkins" />
              </div>

              <div>
                <label className="text-xs text-white/60">Target Role</label>
                <Input className="mt-1" placeholder="Software Engineer / UI Developer" />
              </div>

              <div>
                <label className="text-xs text-white/60">Location</label>
                <Input className="mt-1" placeholder="Detroit, MI" />
              </div>

              <Button className="w-full mt-2">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold">Top Skills</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>React</Badge>
              <Badge>Tailwind</Badge>
              <Badge>Java</Badge>
              <Badge>SQL</Badge>
              <Badge>UI/UX</Badge>
            </div>
          </Card>
        </div>
      </AppShell>

      <BottomNav />
    </>
  );
}
