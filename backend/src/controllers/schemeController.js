const asyncHandler = require('../utils/asyncHandler');
const { ok, created, noContent } = require('../utils/ApiResponse');
const { parsePagination, buildMeta } = require('../utils/pagination');
const Scheme = require('../models/Scheme');
const ApiError = require('../utils/ApiError');
const { refreshSchemeLive } = require('../services/geminiSchemeService');

function buildFilter(q) {
  const filter = { isActive: true };
  if (q.state && q.state !== 'All India') filter.$or = [{ state: q.state }, { state: 'All India' }];
  if (q.category && q.category !== 'All') filter.category = q.category;
  if (q.educationLevel && q.educationLevel !== 'any') {
    filter.educationLevel = { $in: [q.educationLevel, 'any'] };
  }
  if (q.gender && q.gender !== 'All') filter.gender = { $in: [q.gender, 'All'] };
  if (typeof q.income === 'number') {
    filter.$and = [{
      $or: [{ incomeLimit: { $exists: false } }, { incomeLimit: null }, { incomeLimit: { $gte: q.income } }],
    }];
  }
  if (q.q) filter.$text = { $search: q.q };
  return filter;
}

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildFilter(req.query);

  const sortMap = { newest: { createdAt: -1 }, deadline: { deadline: 1 }, popular: { viewCount: -1 } };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [items, total] = await Promise.all([
    Scheme.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Scheme.countDocuments(filter),
  ]);
  return ok(res, items, 'Schemes fetched', buildMeta({ page, limit, total }));
});

const getById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true });
  if (!scheme) throw ApiError.notFound('Scheme not found');
  return ok(res, scheme, 'Scheme fetched');
});

const create = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create({ ...req.body, createdBy: req.user.id });
  return created(res, scheme, 'Scheme created');
});

const update = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!scheme) throw ApiError.notFound('Scheme not found');
  return ok(res, scheme, 'Scheme updated');
});

const remove = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndDelete(req.params.id);
  if (!scheme) throw ApiError.notFound('Scheme not found');
  return noContent(res);
});

// Admin-only: re-verify a scheme's benefits/eligibility/deadline/link against
// the live web via Gemini + Google Search, and merge the fresh fields into
// the existing DB record. The scheme's _id (and therefore any bookmarks) is
// untouched.
const refreshFromAI = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) throw ApiError.notFound('Scheme not found');

  const fresh = await refreshSchemeLive(scheme);
  if (!fresh) {
    throw ApiError.badRequest('AI could not confidently verify this scheme against live search results.');
  }

  scheme.eligibility = fresh.eligibility || scheme.eligibility;
  scheme.benefits = fresh.benefits || scheme.benefits;
  scheme.requiredDocuments = Array.isArray(fresh.requiredDocuments) ? fresh.requiredDocuments : scheme.requiredDocuments;
  scheme.officialLink = fresh.officialLink || scheme.officialLink;
  scheme.deadline = fresh.deadline ? new Date(fresh.deadline) : null;
  if (typeof fresh.incomeLimit === 'number') scheme.incomeLimit = fresh.incomeLimit;
  await scheme.save();

  return ok(res, scheme, 'Scheme refreshed from live AI search');
});

module.exports = { list, getById, create, update, remove, refreshFromAI };
