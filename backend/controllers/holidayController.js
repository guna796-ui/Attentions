const Holiday = require('../models/Holiday');
const { sendResponse, sendError } = require('../utils/helpers');

// @desc    Add Holiday (Admin)
// @route   POST /api/holiday
// @access  Private (Admin)
exports.addHoliday = async (req, res) => {
    try {
        const { name, date, type, description } = req.body;
        if (!name || !date) {
            return sendError(res, 400, 'Name and date are required');
        }
        const holiday = await Holiday.create({
            name,
            date: new Date(date),
            type: type || 'government',
            description: description || ''
        });
        sendResponse(res, 201, true, 'Holiday added', { holiday });
    } catch (error) {
        console.error('Add holiday error:', error);
        sendError(res, 500, 'Server error while adding holiday', error);
    }
};

// @desc    Get All Holidays
// @route   GET /api/holiday
// @access  Private (Admin)
exports.getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({ date: 1 });
        sendResponse(res, 200, true, 'Holidays fetched', { holidays });
    } catch (error) {
        console.error('Get holidays error:', error);
        sendError(res, 500, 'Server error while fetching holidays', error);
    }
};

// @desc    Delete Holiday (Admin)
// @route   DELETE /api/holiday/:id
// @access  Private (Admin)
exports.deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await Holiday.findByIdAndDelete(id);
        if (!holiday) {
            return sendError(res, 404, 'Holiday not found');
        }
        sendResponse(res, 200, true, 'Holiday deleted', { holiday });
    } catch (error) {
        console.error('Delete holiday error:', error);
        sendError(res, 500, 'Server error while deleting holiday', error);
    }
};
