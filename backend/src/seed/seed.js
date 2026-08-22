/**
 * Seed script — loads fixtures from ./data/*.json into MongoDB.
 * Usage:
 *   node src/seed/seed.js           # upsert (keep existing data)
 *   node src/seed/seed.js --reset   # drop domain collections first
 */
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { connectDatabase, disconnectDatabase } = require('../config/database');
const logger = require('../utils/logger');

const User = require('../models/User');
const Scheme = require('../models/Scheme');
const DocumentGuide = require('../models/DocumentGuide');
const { generateSchemesForSeed } = require('../services/geminiSchemeService');
// Scholarships are no longer seeded from static fixtures — they're fetched
// live from Gemini (Google Search grounding) at request time. See
// src/services/geminiScholarshipService.js and src/controllers/scholarshipController.js.

function load(name) {
  const p = path.join(__dirname, 'data', `${name}.json`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@studentsathi.in').toLowerCase();
  const name = process.env.ADMIN_NAME || 'Sathi Admin';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
  const existing = await User.findOne({ email });
  if (existing) {
    logger.info(`Admin already exists: ${email}`);
    return existing;
  }
  const admin = await User.create({ name, email, password, role: 'admin' });
  logger.info(`✅ Admin created — email: ${email} / password: ${password}`);
  return admin;
}

async function upsertMany(Model, records, uniqueKey) {
  for (const r of records) {
    const filter = uniqueKey ? { [uniqueKey]: r[uniqueKey] } : { title: r.title };
    await Model.updateOne(filter, { $set: r }, { upsert: true });
  }
  logger.info(`  → ${records.length}× ${Model.modelName}`);
}

// Schemes are sourced live from Gemini (Google Search grounding) instead of
// a hand-typed fixture, so the seeded data reflects real, currently-active
// schemes rather than guessed/placeholder numbers. Admins can still edit or
// delete any seeded scheme afterwards via the existing CRUD endpoints.
async function seedSchemesFromAI() {
  if (!process.env.GEMINI_API_KEY) {
    logger.warn(
      '⚠️  GEMINI_API_KEY not set — skipping scheme seeding (no dummy fallback data is used). ' +
        'Set the key and re-run `npm run seed` to populate schemes, or add them via the admin API.'
    );
    return;
  }
  logger.info('🔎 Sourcing real, current schemes via Gemini + Google Search…');
  const schemes = await generateSchemesForSeed(24);
  if (!schemes.length) {
    logger.warn('⚠️  AI scheme sourcing returned no usable results — nothing seeded.');
    return;
  }
  await upsertMany(Scheme, schemes, 'title');
}

async function main() {
  const reset = process.argv.includes('--reset');
  await connectDatabase();
  logger.info('🌱 Seeding StudentSathi database…');

  if (reset) {
    logger.warn('⚠️  --reset: clearing domain collections');
    await Promise.all([
      Scheme.deleteMany({}),
      DocumentGuide.deleteMany({}),
    ]);
  }

  // Admin account is still seeded so the scheme admin-write endpoints
  // (POST/PUT/DELETE /schemes) remain usable via a bearer token, even
  // though there's no login UI in this trimmed build.
  await ensureAdmin();
  await seedSchemesFromAI();
  await upsertMany(DocumentGuide, load('documents'), 'documentName');

  logger.info('🌱 Seed complete.');
  await disconnectDatabase();
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  logger.error({ err }, 'Seed failed');
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
