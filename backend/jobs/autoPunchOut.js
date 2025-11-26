const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const { getDateRange } = require('../utils/helpers');

// Auto punch-out job - runs daily at 11:30 PM
const autoPunchOutJob = cron.schedule('30 23 * * *', async () => {
    try {
        console.log('Running auto punch-out job at 11:30 PM...');

        const today = new Date();
        const { start, end } = getDateRange(today);

        // Find all attendance records for today where punchIn exists but punchOut doesn't
        const attendanceRecords = await Attendance.find({
            date: { $gte: start, $lte: end },
            punchIn: { $exists: true, $ne: null },
            punchOut: { $exists: false }
        });

        if (attendanceRecords.length === 0) {
            console.log('No employees to auto punch-out');
            return;
        }

        // Auto punch-out time: 11:30 PM
        const autoPunchOutTime = new Date();
        autoPunchOutTime.setHours(23, 30, 0, 0);

        let count = 0;
        for (const record of attendanceRecords) {
            record.punchOut = autoPunchOutTime;
            record.punchOutLocation = {
                latitude: null,
                longitude: null,
                address: 'Auto punch-out'
            };
            record.isAutoPunchOut = true;

            // Calculate working hours
            record.calculateWorkingHours();
            await record.save();
            count++;
        }

        console.log(`Auto punched-out ${count} employees at 11:30 PM`);
    } catch (error) {
        console.error('Error in auto punch-out job:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set to Indian timezone
});

// For testing: Manual trigger function (can be called via API endpoint)
const triggerAutoPunchOut = async () => {
    try {
        console.log('Manually triggering auto punch-out...');

        const today = new Date();
        const { start, end } = getDateRange(today);

        const attendanceRecords = await Attendance.find({
            date: { $gte: start, $lte: end },
            punchIn: { $exists: true, $ne: null },
            punchOut: null
        });

        if (attendanceRecords.length === 0) {
            return { success: true, message: 'No employees to auto punch-out', count: 0 };
        }

        const autoPunchOutTime = new Date();
        autoPunchOutTime.setHours(23, 30, 0, 0);

        let count = 0;
        for (const record of attendanceRecords) {
            record.punchOut = autoPunchOutTime;
            record.punchOutLocation = {
                latitude: null,
                longitude: null,
                address: 'Auto punch-out'
            };
            record.isAutoPunchOut = true;
            record.calculateWorkingHours();
            await record.save();
            count++;
        }

        return { success: true, message: `Auto punched-out ${count} employees`, count };
    } catch (error) {
        console.error('Error in manual auto punch-out:', error);
        return { success: false, message: 'Error during auto punch-out', error: error.message };
    }
};

module.exports = {
    autoPunchOutJob,
    triggerAutoPunchOut
};
