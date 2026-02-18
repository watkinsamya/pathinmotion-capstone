import { useNavigate } from "react-router-dom";

export default function AppShell({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-brand-cream/90 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center justify-between">
          {/* Left: Back button + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full bg-black/5 text-sm font-semibold flex items-center justify-center hover:bg-black/10 transition"
              aria-label="Go back"
            >
              ←
            </button>

            <div>
              <p className="text-xs text-black/40">Path in Motion</p>
              <h1 className="text-base font-semibold">{title}</h1>
            </div>
          </div>

          {/* Right: menu placeholder */}
          <button
            className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-md px-4 pt-4">
        {children}
      </main>
    </div>
  );
}


