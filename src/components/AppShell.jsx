export default function AppShell({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center px-4 py-6">
      <div className="w-full max-w-[390px] rounded-[28px] border border-white/10 bg-slate-950 shadow-2xl overflow-hidden">
        <div className="sticky top-0 z-10 backdrop-blur bg-slate-950/70 border-b border-white/10 px-5 py-4">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="px-5 py-5 pb-24">{children}</div>
      </div>
    </div>
  );
}
