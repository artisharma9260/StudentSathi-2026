const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    avatarUrl: String,

    studentProfile: {
      phone: String,
      dob: Date,
      gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not'] },
      collegeName: String,
      bio: String,
    },

    savedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
    // Note: scholarships are fetched live via AI search (no stable DB records
    // to reference), so there's no savedScholarships relation any more.

    lastLoginAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
