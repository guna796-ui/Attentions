const LeaveType = require('../models/LeaveType');
const { sendResponse, sendError } = require('../utils/helpers');

// @desc    Get all leave types
// @route   GET /api/leave-types
// @access  Private (All users)
exports.getLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find({ isActive: true });
        sendResponse(res, 200, true, 'Leave types retrieved', leaveTypes);
    } catch (error) {
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Get all leave types (Admin)
// @route   GET /api/leave-types/all
// @access  Private (Admin)
exports.getAllLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find({});
        sendResponse(res, 200, true, 'All leave types retrieved', leaveTypes);
    } catch (error) {
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Create leave type
// @route   POST /api/leave-types
// @access  Private (Admin)
exports.createLeaveType = async (req, res) => {
    try {
        const { name, code, description, defaultDays, color } = req.body;

        const leaveType = await LeaveType.create({
            name,
            code,
            description,
            defaultDays,
            color
        });

        sendResponse(res, 201, true, 'Leave type created', leaveType);
    } catch (error) {
        if (error.code === 11000) {
            return sendError(res, 400, 'Leave type with this name or code already exists');
        }
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Update leave type
// @route   PUT /api/leave-types/:id
// @access  Private (Admin)
exports.updateLeaveType = async (req, res) => {
    try {
        const leaveType = await LeaveType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!leaveType) {
            return sendError(res, 404, 'Leave type not found');
        }

        sendResponse(res, 200, true, 'Leave type updated', leaveType);
    } catch (error) {
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Delete leave type
// @route   DELETE /api/leave-types/:id
// @access  Private (Admin)
exports.deleteLeaveType = async (req, res) => {
    try {
        const leaveType = await LeaveType.findById(req.params.id);

        if (!leaveType) {
            return sendError(res, 404, 'Leave type not found');
        }

        await leaveType.deleteOne();

        sendResponse(res, 200, true, 'Leave type deleted');
    } catch (error) {
        sendError(res, 500, 'Server error', error);
    }
};
