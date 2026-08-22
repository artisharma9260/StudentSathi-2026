const router = require('express').Router();
const c = require('../controllers/documentController');

/** @openapi
 * /documents:      { get: { tags: [Documents], summary: List document guides } }
 * /documents/{id}: { get: { tags: [Documents], summary: Get by id or slug } }
 */
router.get('/', c.list);
router.get('/:id', c.getById);

module.exports = router;
