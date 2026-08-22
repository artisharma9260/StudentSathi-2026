/**
 * AI-assisted scheme sourcing, powered by Gemini + Google Search grounding.
 *
 * Unlike scholarships (fully live, no DB), schemes keep their MongoDB-backed
 * CRUD + bookmarking model — admins can create/edit/delete, and users save
 * schemes by stable _id. So this service is used in two places instead of
 * on every read:
 *
 *  1. `generateSchemesForSeed()` — used once by the seed script to populate
 *     the database with real, currently-active schemes (instead of a
 *     hand-typed fixture that goes stale).
 *  2. `refreshSchemeLive(scheme)` — used by the admin "Refresh from AI"
 *     action (POST /schemes/:id/refresh) to re-check a single scheme's
 *     benefit amount, eligibility, deadline and official link against the
 *     live web without losing its _id (so bookmarks stay intact).
 */
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const GEMINI_ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SCHEME_SHAPE = `{
  "title": string,
  "category": "Scholarship" | "Loan" | "Internship" | "Skill Development" | "Girl Child" | "Minority" | "Disability" | "Rural" | "General",
  "state": string,               // "All India" unless genuinely state-specific
  "educationLevel": "school" | "diploma" | "undergraduate" | "postgraduate" | "phd" | "any",
  "gender": "Male" | "Female" | "All",
  "eligibility": string,
  "incomeLimit": number | null,  // annual family income cap in INR, or null if none
  "benefits": string,
  "requiredDocuments": string[],
  "officialLink": string,
  "deadline": string | null,     // ISO date, or null if rolling/ongoing
  "tags": string[]
}`;

async function callGemini(prompt) {
  if (!config.gemini.apiKey) {
    throw ApiError.internal('GEMINI_API_KEY is not configured on the server — AI scheme sourcing is unavailable.');
  }

  const res = await fetch(`${GEMINI_ENDPOINT(config.gemini.model)}?key=${config.gemini.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    logger.error({ status: res.status, errText }, 'Gemini scheme sourcing failed');
    throw ApiError.internal('AI scheme sourcing failed. Please try again shortly.');
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts || []).map((p) => p.text || '').join('\n');
  return text;
}

function extractJson(text, kind) {
  if (!text) return kind === 'array' ? [] : null;
  let cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  const openChar = kind === 'array' ? '[' : '{';
  const closeChar = kind === 'array' ? ']' : '}';
  const start = cleaned.indexOf(openChar);
  const end = cleaned.lastIndexOf(closeChar);
  if (start === -1 || end === -1 || end < start) return kind === 'array' ? [] : null;

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (err) {
    logger.warn({ err }, 'Failed to parse Gemini scheme JSON');
    return kind === 'array' ? [] : null;
  }
}

/**
 * Ask Gemini to find `count` real, currently-active Government of India (and
 * major state) schemes spanning a healthy mix of categories, for seeding.
 */
async function generateSchemesForSeed(count = 24) {
  const prompt = `You are a research assistant with live Google Search access. Search the web right now and compile a list of ${count} real, currently active Indian government welfare/benefit schemes (central government and major state schemes), covering a healthy mix of these categories: Scholarship, Loan, Internship, Skill Development, Girl Child, Minority, Disability, Rural, General.

Rules:
- Only include schemes you can verify from actual search results — do not invent names, benefit amounts, or links.
- Use the official government portal URL for "officialLink" wherever possible.
- If a deadline is not published (most central schemes are "rolling"/ongoing), set "deadline" to null.
- Keep "benefits" and "eligibility" concise (1-2 sentences each) but factually specific (real amounts, real criteria).
- Avoid duplicates and avoid schemes that have been discontinued or merged into another scheme (mention the successor scheme instead).

Respond with ONLY a raw JSON array (no markdown fences, no commentary). Each element must match exactly this shape:
${SCHEME_SHAPE}`;

  const text = await callGemini(prompt);
  const items = extractJson(text, 'array');
  return Array.isArray(items) ? items.filter((s) => s && s.title && s.officialLink) : [];
}

/**
 * Re-check a single existing scheme's live details (benefits, eligibility,
 * deadline, official link) without touching its DB identity.
 */
async function refreshSchemeLive(scheme) {
  const prompt = `You are a research assistant with live Google Search access. Search the web right now for the current, up-to-date details of this specific Indian government scheme:

Title: "${scheme.title}"
Known provider/state: ${scheme.state || 'All India'}

Find its official page and verify the current benefit amount, eligibility criteria, required documents, and application deadline (or confirm it's rolling/ongoing). If you cannot confidently find this exact scheme, respond with {"found": false}.

Respond with ONLY a raw JSON object (no markdown fences, no commentary) matching exactly this shape:
{
  "found": true,
  ${SCHEME_SHAPE.slice(1, -1)}
}`;

  const text = await callGemini(prompt);
  const result = extractJson(text, 'object');
  if (!result || result.found === false) return null;
  return result;
}

module.exports = { generateSchemesForSeed, refreshSchemeLive };
