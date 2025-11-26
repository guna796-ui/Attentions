const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/helpers');

// @desc    Apply for Leave
// @route   POST /api/leave/apply
// @access  Private (Employee)
exports.applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leaveType, startDate, endDate, reason, halfDay } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return sendError(res, 400, 'Please provide all required fields');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return sendError(res, 400, 'End date cannot be before start date');
        }

        // Calculate total days (including half day logic)
        const msInDay = 24 * 60 * 60 * 1000;
        let totalDays = Math.round((end - start) / msInDay) + 1;
        if (halfDay) totalDays = 0.5;

        // Check leave balance
        const user = await User.findById(userId);
        const balanceField = leaveType;
        if (user.leaveBalance[balanceField] < totalDays) {
            return sendError(res, 400, `Insufficient ${leaveType} balance`);
        }

        const leave = await Leave.create({
            userId,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            halfDay: !!halfDay,
            reason
        });

        sendResponse(res, 201, true, 'Leave application submitted', { leave });
    } catch (error) {
        console.error('Apply leave error:', error);
        sendError(res, 500, 'Server error while applying for leave', error);
    }
};

// @desc    Get My Leave Applications
// @route   GET /api/leave/my-leaves
// @access  Private (Employee)
exports.getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.id;
        const leaves = await Leave.find({ userId }).sort({ createdAt: -1 });
        sendResponse(res, 200, true, 'Leave applications fetched', { leaves });
    } catch (error) {
        console.error('Get my leaves error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Get Leave Balance
// @route   GET /api/leave/balance
// @access  Private (Employee)
exports.getLeaveBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('leaveBalance');
        sendResponse(res, 200, true, 'Leave balance retrieved', { leaveBalance: user.leaveBalance });
    } catch (error) {
        console.error('Leave balance error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Get All Leaves (Admin)
// @route   GET /api/leave/all
// @access  Private (Admin)
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('userId', 'name department').sort({ createdAt: -1 });
        sendResponse(res, 200, true, 'All leaves fetched', { leaves });
    } catch (error) {
        console.error('Get all leaves error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Approve Leave (Admin)
// @route   PUT /api/leave/:id/approve
// @access  Private (Admin)
exports.approveLeave = async (req, res) => {
    try {
        const adminId = req.user.id;
        const leaveId = req.params.id;
        const { comments } = req.body;

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return sendError(res, 404, 'Leave request not found');
        }
        if (leave.status !== 'pending') {
            return sendError(res, 400, 'Leave request already processed');
        }

        // Deduct balance
        const user = await User.findById(leave.userId);
        const balanceField = leave.leaveType;
        if (user.leaveBalance[balanceField] < leave.totalDays) {
            return sendError(res, 400, 'User does not have enough balance to approve');
        }
        user.leaveBalance[balanceField] -= leave.totalDays;
        await user.save();

        leave.status = 'approved';
        leave.approvedBy = adminId;
        leave.approvedAt = new Date();
        leave.notes = comments || '';
        await leave.save();

        sendResponse(res, 200, true, 'Leave approved', { leave });
    } catch (error) {
        console.error('Approve leave error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Reject Leave (Admin)
// @route   PUT /api/leave/:id/reject
// @access  Private (Admin)
exports.rejectLeave = async (req, res) => {
    try {
        const adminId = req.user.id;
        const leaveId = req.params.id;
        const { comments } = req.body;

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return sendError(res, 404, 'Leave request not found');
        }
        if (leave.status !== 'pending') {
            return sendError(res, 400, 'Leave request already processed');
        }

        leave.status = 'rejected';
        leave.approvedBy = adminId;
        leave.approvedAt = new Date();
        leave.rejectionReason = comments || '';
        await leave.save();

        sendResponse(res, 200, true, 'Leave rejected', { leave });
    } catch (error) {
        console.error('Reject leave error:', error);
        sendError(res, 500, 'Server error', error);
    }
};
