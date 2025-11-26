const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Leave type name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Leave type code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    defaultDays: {
        type: Number,
        required: [true, 'Default days per year is required'],
        min: 0
    },
    color: {
        type: String,
        default: 'blue' // blue, green, purple, yellow, red, indigo, pink, gray
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
