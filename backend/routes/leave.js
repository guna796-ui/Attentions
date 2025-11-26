const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    applyLeave,
    getMyLeaves,
    getLeaveBalance,
    getAllLeaves,
    approveLeave,
    rejectLeave
} = require('../controllers/leaveController');

const router = express.Router();

router.use(protect);

// Employee routes
router.post('/apply', authorize('employee', 'admin'), applyLeave);
router.get('/my-leaves', authorize('employee', 'admin'), getMyLeaves);
router.get('/balance', authorize('employee', 'admin'), getLeaveBalance);

// Admin routes
router.get('/all', authorize('admin'), getAllLeaves);
router.put('/:id/approve', authorize('admin'), approveLeave);
router.put('/:id/reject', authorize('admin'), rejectLeave);

module.exports = router;
