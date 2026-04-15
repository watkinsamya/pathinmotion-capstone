export function calculateMatchScore(extractedSkills = [], requirements = []) {
  if (!requirements.length) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }

  const resumeSkills = extractedSkills.map((s) => s.toLowerCase());
  const reqs = requirements.map((r) => r.toLowerCase());

  const matchedSkills = reqs.filter((req) =>
    resumeSkills.some((skill) => skill.includes(req) || req.includes(skill))
  );

  const missingSkills = reqs.filter((req) => !matchedSkills.includes(req));

  const score = Math.round((matchedSkills.length / reqs.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills
  };
}