const express = require('express');
const { authMiddleware, authorize } = require("../middleware/auth-middleware");
const {getAllUsers, getAllJobs, updateUserRole, deleteUser} = require('../controllers/admin-controller');

const router = express.Router();

router.get('/user', authMiddleware, authorize('admin'), getAllUsers);
router.get('/job', authMiddleware, authorize('admin'), getAllJobs);
router.put('/users/:id/role', authMiddleware, authorize('admin'), updateUserRole);
router.delete('/users/:id/', authMiddleware, authorize('admin'), deleteUser);

module.exports = router;