const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema(
  { order: Number, title: String, description: String, url: String },
  { _id: false }
);

const DocumentGuideSchema = new mongoose.Schema(
  {
    documentName: { type: String, required: true, unique: true, index: true },
    slug: { type: String, unique: true, sparse: true },
    summary: String,
    requiredDocuments: [String],
    steps: [StepSchema],
    fees: String,
    timeline: String,
    officialWebsite: String,
    commonMistakes: [String],
    icon: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentGuide', DocumentGuideSchema);
