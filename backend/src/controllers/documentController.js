const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/ApiResponse');
const DocumentGuide = require('../models/DocumentGuide');
const ApiError = require('../utils/ApiError');

const list = asyncHandler(async (_req, res) => {
  const items = await DocumentGuide.find({ isActive: true }).sort({ documentName: 1 }).lean();
  return ok(res, items, 'Document guides fetched');
});

const getById = asyncHandler(async (req, res) => {
  const item =
    (await DocumentGuide.findById(req.params.id).catch(() => null)) ||
    (await DocumentGuide.findOne({ slug: req.params.id }));
  if (!item) throw ApiError.notFound('Document guide not found');
  return ok(res, item, 'Document guide fetched');
});

module.exports = { list, getById };
