import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Briefcase, User } from "lucide-react";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/matches", label: "Matches", icon: Sparkles },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-6">
      <div className="w-full max-w-[390px]">
        <div className="mx-2 rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur shadow-xl px-3 py-2 flex justify-between">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={active ? "opacity-100" : "opacity-70"} />

                <span className={`text-xs ${active ? "text-white" : "text-white/70"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}