/**
 * Real-time scholarship search powered by Gemini + Google Search grounding.
 *
 * There is no static/mock scholarship data anymore. Every request to
 * GET /scholarships makes (or reuses a short-lived cached) live call to the
 * Gemini API with the `google_search` tool enabled, so results reflect what
 * is actually on the web right now (current deadlines, live portals, etc.)
 * instead of a hardcoded list.
 *
 * Responses are cached in-memory for a few minutes per unique query so that
 * repeated page loads / filter tweaks don't re-hit the Gemini API (and its
 * quota) on every request.
 */
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const GEMINI_ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// query signature -> { expiresAt, payload }
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function cacheKey({ q, state, educationLevel, limit }) {
  return JSON.stringify({
    q: (q || '').trim().toLowerCase(),
    state: state || 'All India',
    educationLevel: educationLevel || 'any',
    limit: limit || 24,
  });
}

function buildPrompt({ q, state, educationLevel, limit }) {
  const filters = [];
  if (state && state !== 'All India') filters.push(`the student is based in ${state}, India`);
  if (educationLevel && educationLevel !== 'any') filters.push(`education level: ${educationLevel}`);
  if (q && q.trim()) filters.push(`matching this search: "${q.trim()}"`);

  const filterText = filters.length ? `Filters: ${filters.join('; ')}.` : 'No extra filters — return a broad, popular mix.';

  return `You are a research assistant with live Google Search access. Search the web right now and find up to ${limit} real, currently active or recently active scholarships for Indian students (government, private, or international bodies that fund Indian students).

${filterText}

Rules:
- Only include scholarships you can verify from actual search results. Do not invent names, amounts, or links.
- Prefer official sources (ministry sites, NSP, AICTE, UGC, foundation/CSR pages) over aggregator/blog sites when picking the officialLink.
- If a deadline is not clearly published, set "deadline" to null instead of guessing.
- "amount" should be a short human-readable string, e.g. "₹50,000 / year" or "Up to ₹6,00,000".
- "type" must be exactly one of: "Government", "Private", "International".
- "educationLevel" should be one of: "school", "undergraduate", "postgraduate", "any".
- "state" should be "All India" unless the scholarship is genuinely restricted to one Indian state.

Respond with ONLY a raw JSON array (no markdown fences, no commentary, no leading/trailing text). Each element must match exactly this shape:
{
  "name": string,
  "provider": string,
  "type": "Government" | "Private" | "International",
  "amount": string,
  "deadline": string | null,
  "eligibility": string,
  "description": string,
  "officialUrl": string,
  "state": string,
  "educationLevel": "school" | "undergraduate" | "postgraduate" | "any",
  "tags": string[]
}`;
}

function extractJsonArray(text) {
  if (!text) return [];
  let cleaned = text.trim();
  // Strip ```json ... ``` or ``` ... ``` fences if the model added them anyway.
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) return [];

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    logger.warn({ err }, 'Failed to parse Gemini scholarship JSON');
    return [];
  }
}

const PALETTES = [
  'bg-emerald-100 text-emerald-700',
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
  'bg-slate-100 text-slate-700',
  'bg-sky-100 text-sky-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-purple-100 text-purple-700',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function normalize(raw) {
  const name = raw.name || raw.title;
  const officialUrl = raw.officialUrl || raw.officialLink;
  if (!name || !officialUrl) return null; // drop anything the model failed to ground properly

  const id = `live-${hash(`${name}-${raw.provider || ''}`)}`;
  return {
    id,
    name,
    provider: raw.provider || 'Unknown provider',
    type: ['Government', 'Private', 'International'].includes(raw.type) ? raw.type : 'Private',
    amount: raw.amount || 'See official site',
    deadline: raw.deadline || null,
    eligibility: raw.eligibility || '',
    description: raw.description || raw.eligibility || '',
    officialUrl,
    state: raw.state || 'All India',
    educationLevel: raw.educationLevel || 'any',
    tags: Array.isArray(raw.tags) ? raw.tags.slice(0, 4) : [],
    color: PALETTES[hash(id) % PALETTES.length],
  };
}

async function searchScholarshipsLive(filters) {
  const key = cacheKey(filters);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  if (!config.gemini.apiKey) {
    throw ApiError.internal(
      'GEMINI_API_KEY is not configured on the server — live scholarship search is unavailable.'
    );
  }

  const prompt = buildPrompt(filters);

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
    logger.error({ status: res.status, errText }, 'Gemini scholarship search failed');
    throw ApiError.internal('Live scholarship search failed. Please try again shortly.');
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = (candidate?.content?.parts || []).map((p) => p.text || '').join('\n');
  const groundingSources = (candidate?.groundingMetadata?.groundingChunks || [])
    .map((c) => c?.web?.uri)
    .filter(Boolean);

  const rawItems = extractJsonArray(text);
  const items = rawItems.map(normalize).filter(Boolean);

  const payload = { items, sources: [...new Set(groundingSources)], fetchedAt: new Date().toISOString() };
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, payload });
  return payload;
}

module.exports = { searchScholarshipsLive };
