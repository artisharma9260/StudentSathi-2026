// Static filter-menu options for the Schemes page. This is UI config, not
// scheme data — the actual scheme records now come live from the backend
// (which is itself sourced from Gemini + Google Search, not hardcoded).
//
// categoryOptions intentionally mirrors the backend Scheme model's enum
// (backend/src/models/Scheme.js) so every filter option actually maps to
// real, matchable records instead of silently returning zero results.
export const stateOptions = [
  "All India",
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
];

export const categoryOptions = [
  "All",
  "Scholarship",
  "Loan",
  "Internship",
  "Skill Development",
  "Girl Child",
  "Minority",
  "Disability",
  "Rural",
  "General",
];

export const eduOptions = ["All", "school", "diploma", "undergraduate", "postgraduate", "phd"];
export const genderOptions = ["All", "Male", "Female"];
