const router = require('express').Router();
const c = require('../controllers/scholarshipController');
const { aiSearchLimiter } = require('../middleware/rateLimiter');

/**
 * @openapi
 * /scholarships: { get: { tags: [Scholarships], summary: Live AI (Gemini + Google Search) scholarship search } }
 */
router.get('/', aiSearchLimiter, c.list);

module.exports = router;
