import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Divider } from "../components/UI";

export default function MentorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const mentor   = location.state?.mentor;
  const [requested, setRequested] = useState(() => {
    const sessions = JSON.parse(localStorage.getItem("pm_sessions")) || {};
    return !!sessions[mentor?.id];
  });

  if (!mentor) {
    return (
      <>
        <AppShell title="Mentor Profile">
          <Card className="text-brand-ink text-center py-8">
            <p className="text-2xl mb-2">👤</p>
            <p className="font-semibold">Mentor not found</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/mentors")}>
              Back to Mentors
            </Button>
          </Card>
        </AppShell>
        <BottomNav />
      </>
    );
  }

  function handleRequest() {
    const sessions = JSON.parse(localStorage.getItem("pm_sessions")) || {};
    sessions[mentor.id] = {
      mentorId:    mentor.id,
      mentorName:  mentor.name,
      mentorTitle: mentor.role,
      company:     mentor.company,
      status:      "Pending",
      requestedAt: new Date().toLocaleString(),
    };
    localStorage.setItem("pm_sessions", JSON.stringify(sessions));
    setRequested(true);
  }

  return (
    <>
      <AppShell title="Mentor Profile">
        <div className="space-y-4">

          <Card className="text-brand-ink">
            <div className="flex items-start gap-4">
              <div className={"w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 " + mentor.color}>
                {mentor.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{mentor.name}</h2>
                <p className="text-sm text-black/60">{mentor.role}</p>
                <p className="text-xs text-black/45 mt-1">
                  {mentor.company} · {mentor.years} yrs experience
                </p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs font-semibold text-yellow-600">⭐ {mentor.rating}</span>
                  <span className="text-xs text-black/45">{mentor.sessions} sessions</span>
                  <Badge tone="success">{mentor.fit}% Fit</Badge>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <h3 className="font-semibold text-sm mb-2">About</h3>
            <p className="text-sm text-black/70 leading-relaxed">{mentor.bio}</p>

            <Divider className="my-4" />

            <h3 className="font-semibold text-sm mb-2">Industry</h3>
            <Badge tone="success">{mentor.industry}</Badge>

            <h3 className="font-semibold text-sm mt-4 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.skills?.map((s) => (
                <Badge key={s} tone="pink">{s}</Badge>
              ))}
            </div>

            <h3 className="font-semibold text-sm mt-4 mb-1">Availability</h3>
            <p className="text-sm text-black/60">{mentor.availability}</p>

            <Divider className="my-4" />

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleRequest}
                disabled={requested}
              >
                {requested ? "Session Requested ✓" : "Request Session"}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => navigate("/mentors/" + mentor.id + "/message", { state: { mentor } })}
              >
                Send Message
              </Button>
            </div>

            {requested && (
              <p className="text-xs text-green-600 text-center mt-2">
                Your request has been sent! You will hear back soon.
              </p>
            )}
          </Card>

          <Card className="text-brand-ink">
            <h3 className="font-semibold mb-3">What to expect</h3>
            <div className="space-y-3">
              {[
                { icon: "💬", title: "Intro call",      desc: "15-min chat to discuss your goals and background." },
                { icon: "📋", title: "Resume review",   desc: "Detailed feedback on how to improve your resume."  },
                { icon: "🎯", title: "Career guidance", desc: "Personalized advice on your target role."          },
                { icon: "🤝", title: "Ongoing support", desc: "Follow-up sessions as you progress."              },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-black/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}