const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth-middleware');
const { applicationForJobApply } = require('../controllers/application-controller');
const upload = require('../middleware/upload-middleware');


router.post('/apply', authorize('seeker'), upload.single('resume'), applicationForJobApply);

module.exports = router;