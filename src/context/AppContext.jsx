import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "../lib/storage";

const AppContext = createContext(null);

const defaultState = {
  user: { name: "Amya", email: "demo@pathinmotion.com" },
  savedMatches: [],
  savedScholarships: [],
  savedJobs: [],
  appliedJobs: [],
  resumeUploaded: false,
  resumeText: "",
  resumeSummary: "",
  extractedSkills: [],
  targetRoles: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState() ?? defaultState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      toggleSavedMatch(id) {
        setState((s) => ({
          ...s,
          savedMatches: s.savedMatches.includes(id)
            ? s.savedMatches.filter((x) => x !== id)
            : [...s.savedMatches, id],
        }));
      },

      toggleSavedScholarship(id) {
        setState((s) => ({
          ...s,
          savedScholarships: s.savedScholarships.includes(id)
            ? s.savedScholarships.filter((x) => x !== id)
            : [...s.savedScholarships, id],
        }));
      },

      toggleSavedJob(id) {
        setState((s) => ({
          ...s,
          savedJobs: s.savedJobs.includes(id)
            ? s.savedJobs.filter((x) => x !== id)
            : [...s.savedJobs, id],
        }));
      },

      applyToJob(jobId) {
        setState((s) => {
          const alreadyApplied = s.appliedJobs.some((job) => job.id === jobId);

          if (alreadyApplied) return s;

          return {
            ...s,
            appliedJobs: [
              ...s.appliedJobs,
              {
                id: jobId,
                status: "Applied",
                appliedDate: new Date().toLocaleDateString(),
              },
            ],
          };
        });
      },

      updateApplicationStatus(jobId, status) {
        setState((s) => ({
          ...s,
          appliedJobs: s.appliedJobs.map((job) =>
            job.id === jobId ? { ...job, status } : job
          ),
        }));
      },

      removeAppliedJob(jobId) {
        setState((s) => ({
          ...s,
          appliedJobs: s.appliedJobs.filter((job) => job.id !== jobId),
        }));
      },

      setResumeAnalysis({ resumeText, skills, summary, targetRoles }) {
        setState((s) => ({
          ...s,
          resumeUploaded: true,
          resumeText,
          extractedSkills: skills,
          resumeSummary: summary,
          targetRoles,
        }));
      },

      clearResume() {
        setState((s) => ({
          ...s,
          resumeUploaded: false,
          resumeText: "",
          resumeSummary: "",
          extractedSkills: [],
          targetRoles: [],
        }));
      },
    }),
    []
  );

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}