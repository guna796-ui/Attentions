const { startOfDay, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, format } = require('date-fns');

// Get start and end of a date
exports.getDateRange = (date) => {
    return {
        start: startOfDay(new Date(date)),
        end: endOfDay(new Date(date))
    };
};

// Get start and end of month
exports.getMonthRange = (year, month) => {
    const date = new Date(year, month - 1, 1);
    return {
        start: startOfMonth(date),
        end: endOfMonth(date)
    };
};

// Get custom payroll period (6th to 5th)
exports.getPayrollPeriod = (date = new Date()) => {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let startDate, endDate;

    if (currentDay >= 6) {
        // Current period: 6th of this month to 5th of next month
        startDate = new Date(currentYear, currentMonth, 6);
        endDate = new Date(currentYear, currentMonth + 1, 5, 23, 59, 59, 999);
    } else {
        // Previous period: 6th of last month to 5th of this month
        startDate = new Date(currentYear, currentMonth - 1, 6);
        endDate = new Date(currentYear, currentMonth, 5, 23, 59, 59, 999);
    }

    return { startDate, endDate };
};

// Calculate working days between two dates (excluding weekends)
exports.calculateWorkingDays = (startDate, endDate, holidays = []) => {
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });

    const holidayDates = holidays.map(h => format(new Date(h.date), 'yyyy-MM-dd'));

    const workingDays = days.filter(day => {
        const isWeekendDay = isWeekend(day);
        const isHoliday = holidayDates.includes(format(day, 'yyyy-MM-dd'));
        return !isWeekendDay && !isHoliday;
    });

    return workingDays.length;
};

// Format date to YYYY-MM-DD
exports.formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
};

// Check if date is today
exports.isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
};

// Get all dates in a month
exports.getDatesInMonth = (year, month) => {
    const { start, end } = exports.getMonthRange(year, month);
    return eachDayOfInterval({ start, end });
};

// Calculate late minutes
exports.calculateLateMinutes = (punchInTime, standardTime = '09:30') => {
    const [hours, minutes] = standardTime.split(':');
    const punchIn = new Date(punchInTime);
    const standard = new Date(punchIn);
    standard.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (punchIn > standard) {
        const diff = punchIn - standard;
        return Math.floor(diff / (1000 * 60));
    }
    return 0;
};

// Calculate working hours
exports.calculateWorkingHours = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return 0;
    const diff = new Date(punchOut) - new Date(punchIn);
    return parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
};

// Response handler
exports.sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

// Error handler
exports.sendError = (res, statusCode, message, error = null) => {
    const response = {
        success: false,
        message
    };

    if (error && process.env.NODE_ENV === 'development') {
        response.error = error.message;
    }

    return res.status(statusCode).json(response);
};
