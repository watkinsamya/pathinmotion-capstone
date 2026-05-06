import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Button } from "../components/UI";

const SERVER = "http://localhost:8787";

const QUICK_QUESTIONS = [
  "How do I break into your field?",
  "Can you review my resume?",
  "What skills should I focus on?",
  "How did you get your current role?",
  "What certifications do you recommend?",
  "What does your day-to-day look like?",
];

export default function MentorMessage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const mentor    = location.state?.mentor;
  const bottomRef = useRef(null);
  const storageKey = "pm_chat_" + (mentor?.id || "unknown");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return [{
      role:    "mentor",
      content: "Hi! I'm " + (mentor?.name || "your mentor") + ", " +
               (mentor?.role || "") + " at " + (mentor?.company || "") +
               ". I'm here to help with your career questions. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }];
  });

  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, storageKey]);

  if (!mentor) {
    return (
      <>
        <AppShell title="Message">
          <Card className="text-brand-ink text-center py-8">
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

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg = {
      role:    "user",
      content: userText,
      time:    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res  = await fetch(SERVER + "/api/mentor-chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          mentorName:     mentor.name,
          mentorTitle:    mentor.role,
          mentorCompany:  mentor.company,
          mentorIndustry: mentor.industry,
          mentorBio:      mentor.bio,
          mentorSkills:   mentor.skills,
          userMessage:    userText,
          history:        messages,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role:    "mentor",
        content: data.reply || "That is a great question! Let me share my thoughts.",
        time:    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role:    "mentor",
        content: "Sorry, I am having trouble connecting. Please try again in a moment.",
        time:    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppShell title={"Chat with " + mentor.name}>
        <div className="flex flex-col gap-3">

          <Card className="text-brand-ink py-3">
            <div className="flex items-center gap-3">
              <div className={"w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 " + mentor.color}>
                {mentor.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{mentor.name}</p>
                <p className="text-xs text-black/50">{mentor.role} · {mentor.company}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </div>
          </Card>

          <div className="flex flex-col gap-2 min-h-[300px] max-h-[380px] overflow-y-auto px-1">
            {messages.map((msg, i) => (
              <div key={i} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm " +
                  (msg.role === "user"
                    ? "bg-brand-ink text-white rounded-br-sm"
                    : "bg-black/5 text-brand-ink rounded-bl-sm")
                }>
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={"text-xs mt-1 " + (msg.role === "user" ? "text-white/60" : "text-black/40")}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-black/5 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-black/30 rounded-full animate-bounce"
                        style={{ animationDelay: delay + "ms" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 text-xs bg-white border border-black/10 rounded-full px-3 py-1.5 text-black/70 hover:bg-black/5 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(); }}
              placeholder={"Ask " + mentor.name + " a question..."}
              className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-sun/50"
            />
            <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-5">
              Send
            </Button>
          </div>

        </div>
      </AppShell>
      <BottomNav />
    </>
  );
}