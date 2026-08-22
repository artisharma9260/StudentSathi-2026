const router = require('express').Router();
const validate = require('../middleware/validate');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { aiSearchLimiter } = require('../middleware/rateLimiter');
const c = require('../controllers/schemeController');
const v = require('../validators/schemeValidators');

/**
 * @openapi
 * /schemes:
 *   get:  { tags: [Schemes], summary: List schemes with filters, search, pagination }
 *   post: { tags: [Schemes], summary: Create scheme (admin), security: [{ bearerAuth: [] }] }
 * /schemes/{id}:
 *   get:    { tags: [Schemes], summary: Get scheme by id }
 *   put:    { tags: [Schemes], summary: Update scheme (admin) }
 *   delete: { tags: [Schemes], summary: Delete scheme (admin) }
 * /schemes/{id}/refresh:
 *   post: { tags: [Schemes], summary: Re-verify scheme details via live AI search (admin), security: [{ bearerAuth: [] }] }
 */
router.get('/', optionalAuth, validate({ query: v.listQuerySchema }), c.list);
router.get('/:id', c.getById);
router.post('/', requireAuth, requireAdmin, validate({ body: v.createSchemeSchema }), c.create);
router.put('/:id', requireAuth, requireAdmin, validate({ body: v.updateSchemeSchema }), c.update);
router.delete('/:id', requireAuth, requireAdmin, c.remove);
router.post('/:id/refresh', requireAuth, requireAdmin, aiSearchLimiter, c.refreshFromAI);

module.exports = router;
