const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, unique: true, sparse: true, index: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: [
        'Scholarship', 'Loan', 'Internship', 'Skill Development',
        'Girl Child', 'Minority', 'Disability', 'Rural', 'General',
      ],
      default: 'General',
      index: true,
    },

    state: { type: String, default: 'All India', index: true },
    educationLevel: {
      type: String,
      enum: ['school', 'diploma', 'undergraduate', 'postgraduate', 'phd', 'any'],
      default: 'any',
      index: true,
    },
    gender: { type: String, enum: ['Male', 'Female', 'All'], default: 'All' },
    caste: { type: String, default: 'All' },

    eligibility: { type: String, required: true },
    incomeLimit: { type: Number, min: 0, index: true },

    benefits: { type: String, required: true },
    requiredDocuments: [String],

    officialLink: { type: String, required: true },
    deadline: { type: Date, index: true },

    tags: [{ type: String, index: true }],
    viewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

SchemeSchema.index({ title: 'text', description: 'text', tags: 'text' });
SchemeSchema.index({ state: 1, category: 1, educationLevel: 1 });

module.exports = mongoose.model('Scheme', SchemeSchema);
