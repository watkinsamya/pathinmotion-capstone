import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import BottomNav from "../components/BottomNav";
import { Card, Badge, Button, Input } from "../components/UI";
import { jobs as FALLBACK_JOBS } from "../data/jobs";
import { useApp } from "../context/AppContext";

export default function Jobs() {
  const { state, actions } = useApp();

  const [jobs,          setJobs]          = useState([]);
  const [searchInput,   setSearchInput]   = useState("");
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchJobs("entry level");
  }, []);

  async function fetchJobs(rawQuery) {
    setLoading(true);
    setError("");
    setUsingFallback(false);

    const cleanQuery = (rawQuery || "entry level")
      .replace(/\bjobs\b/gi, "")
      .trim() || "entry level";

    try {
      const res  = await fetch(
        `/api/live-jobs?query=${encodeURIComponent(cleanQuery)}&location=`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
      } else {
        setJobs(FALLBACK_JOBS);
        setUsingFallback(true);
      }
    } catch (err) {
      console.error(err);
      setJobs(FALLBACK_JOBS);
      setUsingFallback(true);
      setError("Could not connect to server. Make sure node server.js is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchJobs(searchInput.trim() || "entry level");
  }

  const filteredJobs = useMemo(() => {
    if (!searchInput.trim()) return jobs;
    const q = searchInput.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        (job.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [jobs, searchInput]);

  return (
    <>
      <AppShell title="Jobs">
        <div className="space-y-3">

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search any job, role, or industry..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="px-4 shrink-0">
              {loading ? "..." : "Go"}
            </Button>
          </form>

          {usingFallback && (
            <p className="text-xs text-black/40 px-1">
              Showing demo jobs — start your server to load live jobs.
            </p>
          )}
          {error && (
            <p className="text-xs text-red-500 px-1">{error}</p>
          )}

          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-brand-ink border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-black/50">Finding opportunities...</p>
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <Card className="text-brand-ink text-center py-8">
              <p className="text-lg mb-1">🔍</p>
              <p className="font-semibold">No jobs found</p>
              <p className="text-sm text-black/60 mt-1">Try a different keyword.</p>
            </Card>
          )}

          {!loading && filteredJobs.map((job) => {
            const isSaved   = state.savedJobs?.includes(job.id);
            const isApplied = state.appliedJobs?.some((a) => a.id === job.id);

            return (
              <Card key={job.id} className="text-brand-ink">

                <div className="flex items-start gap-3">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-black/5 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-brand-ink/10 flex items-center justify-center text-brand-ink font-bold text-sm shrink-0">
                      {(job.company || "?").charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs text-black/60 mt-0.5">{job.company}</p>
                  </div>

                  {isApplied ? (
                    <Badge tone="success">Applied</Badge>
                  ) : (
                    <Badge tone="success">{job.source || "Live"}</Badge>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge tone="pink">📍 {job.location}</Badge>
                  <Badge>{job.type || "Full-time"}</Badge>
                  {job.remote && <Badge tone="success">Remote</Badge>}
                  {job.salary && job.salary !== "Salary not listed" && (
                    <Badge tone="warn">{job.salary}</Badge>
                  )}
                </div>

                <p className="mt-2 text-xs text-black/55 line-clamp-2">
                  {job.description || "No description available."}
                </p>

                <p className="mt-1 text-xs text-black/35">
                  via {job.source || "JSearch"} · {job.posted || "Recent"}
                </p>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={"/jobs/" + job.id}
                    state={{ job }}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full text-xs py-1.5">
                      View
                    </Button>
                  </Link>

                  <Button
                    variant={isSaved ? "primary" : "secondary"}
                    className="flex-1 text-xs py-1.5"
                    onClick={() => actions.toggleSavedJob(job.id)}
                  >
                    {isSaved ? "Saved ✓" : "Save"}
                  </Button>

                  {!isApplied ? (
                    <Link
                      to={"/apply/" + job.id}
                      state={{ job }}
                      className="flex-1"
                    >
                      <Button className="w-full text-xs py-1.5">Apply</Button>
                    </Link>
                  ) : (
                    <Button
                      variant="secondary"
                      className="flex-1 text-xs py-1.5 text-green-600"
                    >
                      Applied ✓
                    </Button>
                  )}
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