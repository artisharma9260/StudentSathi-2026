const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/ApiResponse');
const { searchScholarshipsLive } = require('../services/geminiScholarshipService');

const list = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 24, 40);

  const { items, sources, fetchedAt } = await searchScholarshipsLive({
    q: req.query.q,
    state: req.query.state,
    educationLevel: req.query.educationLevel,
    limit,
  });

  return ok(res, items, 'Scholarships fetched live via AI web search', {
    total: items.length,
    page: 1,
    limit,
    live: true,
    sources,
    fetchedAt,
  });
});

module.exports = { list };
