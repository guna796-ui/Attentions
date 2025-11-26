const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Holiday = require('../models/Holiday');
const { sendResponse, sendError, getDateRange, calculateLateMinutes, calculateWorkingHours, calculateWorkingDays } = require('../utils/helpers');

// @desc    Punch In
// @route   POST /api/attendance/punch-in
// @access  Private (Employee)
exports.punchIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const { start, end } = getDateRange(today);

        // Check if already punched in today
        const existing = await Attendance.findOne({ userId, date: { $gte: start, $lte: end } });
        if (existing && existing.punchIn) {
            return sendError(res, 400, 'You have already punched in today');
        }

        const location = req.body.location || {};
        const attendance = existing || new Attendance({ userId, date: today });
        attendance.punchIn = new Date();
        attendance.punchInLocation = {
            latitude: location.latitude || null,
            longitude: location.longitude || null,
            address: location.address || ''
        };
        // Determine status (present/late)
        const cutoff = new Date(today);
        cutoff.setHours(9, 30, 0, 0);
        if (attendance.punchIn > cutoff) {
            attendance.isLate = true;
            attendance.lateBy = Math.floor((attendance.punchIn - cutoff) / (1000 * 60));
            attendance.status = 'late';
        } else {
            attendance.status = 'present';
        }
        await attendance.save();
        sendResponse(res, 200, true, 'Punch in recorded', { attendance });
    } catch (error) {
        console.error('Punch in error:', error);
        sendError(res, 500, 'Server error during punch in', error);
    }
};

// @desc    Punch Out
// @route   POST /api/attendance/punch-out
// @access  Private (Employee)
exports.punchOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const { start, end } = getDateRange(today);

        const attendance = await Attendance.findOne({ userId, date: { $gte: start, $lte: end } });
        if (!attendance || !attendance.punchIn) {
            return sendError(res, 400, 'You need to punch in before punching out');
        }
        if (attendance.punchOut) {
            return sendError(res, 400, 'You have already punched out today');
        }

        const location = req.body.location || {};
        attendance.punchOut = new Date();
        attendance.punchOutLocation = {
            latitude: location.latitude || null,
            longitude: location.longitude || null,
            address: location.address || ''
        };
        // Calculate working hours and overtime
        attendance.calculateWorkingHours();
        await attendance.save();
        sendResponse(res, 200, true, 'Punch out recorded', { attendance });
    } catch (error) {
        console.error('Punch out error:', error);
        sendError(res, 500, 'Server error during punch out', error);
    }
};

// @desc    Get My Attendance (with optional date range)
// @route   GET /api/attendance/my-attendance
// @access  Private (Employee)
exports.getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const filter = { userId };
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const records = await Attendance.find(filter).sort({ date: -1 });
        sendResponse(res, 200, true, 'Attendance records fetched', { records });
    } catch (error) {
        console.error('Get my attendance error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Get Today's Attendance Status for Employee
// @route   GET /api/attendance/today
// @access  Private (Employee)
exports.getTodayStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const { start, end } = getDateRange(today);
        const attendance = await Attendance.findOne({ userId, date: { $gte: start, $lte: end } });
        if (!attendance) {
            return sendResponse(res, 200, true, 'No attendance recorded for today', { status: 'not-punched' });
        }
        const status = attendance.punchIn && attendance.punchOut ? 'completed' : attendance.punchIn ? 'punched-in' : 'not-punched';
        sendResponse(res, 200, true, 'Today attendance status', { status, attendance });
    } catch (error) {
        console.error('Today status error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Get Attendance Calendar Data (for UI)
// @route   GET /api/attendance/calendar
// @access  Private (Employee)
exports.getCalendarData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month, year } = req.query; // month: 1-12
        const { start, end } = getMonthRange(parseInt(year), parseInt(month));
        const records = await Attendance.find({ userId, date: { $gte: start, $lte: end } });
        // Transform to simple map
        const calendar = {};
        records.forEach(rec => {
            const day = rec.date.getDate();
            calendar[day] = rec.status;
        });
        sendResponse(res, 200, true, 'Calendar data fetched', { calendar });
    } catch (error) {
        console.error('Calendar data error:', error);
        sendError(res, 500, 'Server error', error);
    }
};
