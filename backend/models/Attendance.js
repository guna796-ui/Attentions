const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    punchIn: {
        type: Date,
        default: null
    },
    punchOut: {
        type: Date,
        default: null
    },
    punchInLocation: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        },
        address: {
            type: String,
            default: ''
        }
    },
    punchOutLocation: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        },
        address: {
            type: String,
            default: ''
        }
    },
    workingHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day', 'on-leave', 'holiday'],
        default: 'absent'
    },
    isLate: {
        type: Boolean,
        default: false
    },
    lateBy: {
        type: Number, // minutes
        default: 0
    },
    overtime: {
        type: Number, // hours
        default: 0
    },
    notes: {
        type: String,
        default: ''
    },
    isAutoPunchOut: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create compound index for userId and date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to calculate working hours
attendanceSchema.methods.calculateWorkingHours = function () {
    if (this.punchIn && this.punchOut) {
        const diff = this.punchOut - this.punchIn;
        this.workingHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));

        // Calculate overtime (assuming 9 hours is standard)
        if (this.workingHours > 9) {
            this.overtime = parseFloat((this.workingHours - 9).toFixed(2));
        }
    }
};

// Method to check if late (assuming 9:30 AM is the cutoff)
attendanceSchema.methods.checkIfLate = function () {
    if (this.punchIn) {
        const punchInTime = new Date(this.punchIn);
        const cutoffTime = new Date(this.date);
        cutoffTime.setHours(9, 30, 0, 0);

        if (punchInTime > cutoffTime) {
            this.isLate = true;
            const diff = punchInTime - cutoffTime;
            this.lateBy = Math.floor(diff / (1000 * 60));
        }
    }
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
