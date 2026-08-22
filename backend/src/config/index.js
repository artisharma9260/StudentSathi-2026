/**
 * Centralised, validated configuration loaded from process.env.
 * Fails fast if a required variable is missing in production.
 */
const { z } = require('zod');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be ≥16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be ≥16 chars'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),

  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(300),

  LOG_LEVEL: z.string().default('info'),

  // Gemini (real-time scholarship search via Google Search grounding)
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
});

// In non-production we allow weak/dev defaults so the app can still boot.
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me_1234567890';
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me_1234567890';
  process.env.MONGO_URI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentsathi';
}

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}
const env = parsed.data;

module.exports = {
  raw: env,
  nodeEnv: env.NODE_ENV,
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  clientUrl: env.CLIENT_URL,
  corsOrigins: env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  mongoUri: env.MONGO_URI,
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpires: env.JWT_ACCESS_EXPIRES,
    refreshExpires: env.JWT_REFRESH_EXPIRES,
  },
  cookie: {
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
  },
  rate: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
  logLevel: env.LOG_LEVEL,
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
  },
};

if (!env.GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  GEMINI_API_KEY is not set — live scholarship search (/scholarships) will fail until it is configured.');
}
