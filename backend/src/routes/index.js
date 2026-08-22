const router = require('express').Router();

router.use('/schemes', require('./schemeRoutes'));
router.use('/scholarships', require('./scholarshipRoutes'));
router.use('/documents', require('./documentRoutes'));

module.exports = router;
