import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "../lib/storage";

const AppContext = createContext(null);

const defaultState = {
  user: { name: "Amya", email: "demo@pathinmotion.com" },

  savedMatches: [],
  savedJobs: [],
  savedScholarships: [],

  resumeUploaded: false,
  resumeText: "",
  extractedSkills: [],
  resumeSummary: "",
  targetRoles: []
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ({
    ...defaultState,
    ...(loadState() ?? {})
  }));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      toggleSavedMatch(id) {
        setState((s) => {
          const exists = s.savedMatches.includes(id);
          return {
            ...s,
            savedMatches: exists
              ? s.savedMatches.filter((x) => x !== id)
              : [...s.savedMatches, id]
          };
        });
      },

      toggleSavedJob(id) {
        setState((s) => {
          const exists = s.savedJobs.includes(id);
          return {
            ...s,
            savedJobs: exists
              ? s.savedJobs.filter((x) => x !== id)
              : [...s.savedJobs, id]
          };
        });
      },

      toggleSavedScholarship(id) {
        setState((s) => {
          const exists = s.savedScholarships.includes(id);
          return {
            ...s,
            savedScholarships: exists
              ? s.savedScholarships.filter((x) => x !== id)
              : [...s.savedScholarships, id]
          };
        });
      },

      setResumeAnalysis({ resumeText, skills, summary, targetRoles }) {
        setState((s) => ({
          ...s,
          resumeUploaded: true,
          resumeText,
          extractedSkills: skills,
          resumeSummary: summary,
          targetRoles
        }));
      },

      clearResume() {
        setState((s) => ({
          ...s,
          resumeUploaded: false,
          resumeText: "",
          extractedSkills: [],
          resumeSummary: "",
          targetRoles: []
        }));
      }
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