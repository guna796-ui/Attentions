const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    punchIn,
    punchOut,
    getMyAttendance,
    getTodayStatus,
    getCalendarData
} = require('../controllers/attendanceController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/punch-in', authorize('employee', 'admin'), punchIn);
router.post('/punch-out', authorize('employee', 'admin'), punchOut);
router.get('/my-attendance', authorize('employee', 'admin'), getMyAttendance);
router.get('/today', authorize('employee', 'admin'), getTodayStatus);
router.get('/calendar', authorize('employee', 'admin'), getCalendarData);

module.exports = router;
