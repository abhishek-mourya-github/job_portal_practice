const express = require('express');
const {jobPosting, getAllJobs, getJobByID, filterJob, deleteJobByID} = require('../controllers/job-posting-controller');
const {authMiddleware, authorize} = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/post', authMiddleware ,authorize('recruiter', 'admin'), jobPosting);
router.post('/allJobs', authMiddleware, authorize('recruiter'), getAllJobs);
router.get('/filter', authMiddleware, authorize('recruiter'), filterJob);
router.get('/:id', authMiddleware, authorize('recruiter'), getJobByID);
router.delete('/:id', authMiddleware ,authorize('recruiter', 'admin'), deleteJobByID);

module.exports = router;