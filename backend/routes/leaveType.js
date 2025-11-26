const express = require('express');
const {
    getLeaveTypes,
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType
} = require('../controllers/leaveTypeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getLeaveTypes);
router.get('/all', protect, authorize('admin'), getAllLeaveTypes);
router.post('/', protect, authorize('admin'), createLeaveType);
router.put('/:id', protect, authorize('admin'), updateLeaveType);
router.delete('/:id', protect, authorize('admin'), deleteLeaveType);

module.exports = router;
