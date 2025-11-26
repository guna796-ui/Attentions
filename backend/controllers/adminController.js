const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Holiday = require('../models/Holiday');
const { sendResponse, sendError, getPayrollPeriod, calculateWorkingDays } = require('../utils/helpers');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { triggerAutoPunchOut } = require('../jobs/autoPunchOut');

// @desc    Get All Employees
// @route   GET /api/admin/employees
// @access  Private (Admin)
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        sendResponse(res, 200, true, 'Employees fetched', { employees });
    } catch (error) {
        console.error('Get employees error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Create New Employee (Admin)
// @route   POST /api/admin/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, phone, password, department, designation, joiningDate } = req.body;
        if (!name || !email || !phone || !password || !department || !designation) {
            return sendError(res, 400, 'Missing required fields');
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return sendError(res, 400, 'User with this email already exists');
        }
        const employee = await User.create({
            name,
            email,
            phone,
            password,
            role: 'employee',
            department,
            designation,
            joiningDate: joiningDate || Date.now()
        });
        sendResponse(res, 201, true, 'Employee created', { employee: employee.toJSON() });
    } catch (error) {
        console.error('Create employee error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Update Employee
// @route   PUT /api/admin/employees/:id
// @access  Private (Admin)
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        // Do not allow role change via this endpoint
        delete updateData.role;
        const employee = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        if (!employee) {
            return sendError(res, 404, 'Employee not found');
        }
        sendResponse(res, 200, true, 'Employee updated', { employee });
    } catch (error) {
        console.error('Update employee error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Delete Employee
// @route   DELETE /api/admin/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await User.findByIdAndDelete(id);
        if (!employee) {
            return sendError(res, 404, 'Employee not found');
        }
        // Clean up related data (attendance, leaves)
        await Attendance.deleteMany({ userId: id });
        await Leave.deleteMany({ userId: id });
        sendResponse(res, 200, true, 'Employee and related data removed', { employeeId: id });
    } catch (error) {
        console.error('Delete employee error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Attendance Report (Daily/Weekly/Monthly)
// @route   GET /api/admin/attendance-report
// @access  Private (Admin)
exports.getAttendanceReport = async (req, res) => {
    try {
        const { type, startDate, endDate, employeeId } = req.query; // type: daily, weekly, monthly
        let filter = {};
        if (employeeId) filter.userId = employeeId;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const records = await Attendance.find(filter).populate('userId', 'name email department');
        sendResponse(res, 200, true, 'Attendance report generated', { records });
    } catch (error) {
        console.error('Attendance report error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Payroll Summary for a Period (6th-5th)
// @route   GET /api/admin/payroll-summary
// @access  Private (Admin)
exports.getPayrollSummary = async (req, res) => {
    try {
        const { referenceDate } = req.query; // optional, defaults to today
        const { startDate, endDate } = getPayrollPeriod(referenceDate ? new Date(referenceDate) : new Date());

        // Fetch all employees
        const employees = await User.find({ role: 'employee' }).select('name email department leaveBalance');

        // For each employee, calculate metrics
        const summary = [];
        for (const emp of employees) {
            const attendances = await Attendance.find({ userId: emp._id, date: { $gte: startDate, $lte: endDate } });
            const totalWorkingDays = calculateWorkingDays(startDate, endDate);
            const presents = attendances.filter(a => a.status === 'present' || a.status === 'late').length;
            const absents = totalWorkingDays - presents;
            const lateArrivals = attendances.filter(a => a.isLate).length;
            const overtimeHours = attendances.reduce((sum, a) => sum + (a.overtime || 0), 0);

            summary.push({
                employeeId: emp._id,
                name: emp.name,
                email: emp.email,
                department: emp.department,
                totalWorkingDays,
                presents,
                absents,
                lateArrivals,
                overtimeHours,
                leaveBalance: emp.leaveBalance
            });
        }

        sendResponse(res, 200, true, 'Payroll summary generated', { period: { startDate, endDate }, summary });
    } catch (error) {
        console.error('Payroll summary error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Export Report as CSV
// @route   GET /api/admin/export/csv
// @access  Private (Admin)
exports.exportCsv = async (req, res) => {
    try {
        const { collection } = req.query; // attendance, leave, employee
        let data = [];
        switch (collection) {
            case 'attendance':
                data = await Attendance.find().populate('userId', 'name email');
                break;
            case 'leave':
                data = await Leave.find().populate('userId', 'name email');
                break;
            case 'employee':
                data = await User.find({ role: 'employee' }).select('-password');
                break;
            default:
                return sendError(res, 400, 'Invalid collection type');
        }
        const json2csv = new Parser();
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(`${collection}_report_${Date.now()}.csv`);
        return res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Export Report as PDF (Attendance only for demo)
// @route   GET /api/admin/export/pdf
// @access  Private (Admin)
exports.exportPdf = async (req, res) => {
    try {
        const attendances = await Attendance.find().populate('userId', 'name email');
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const filename = `attendance_report_${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);
        doc.fontSize(18).text('Attendance Report', { align: 'center' });
        doc.moveDown();
        attendances.forEach((a, idx) => {
            doc.fontSize(10).text(`${idx + 1}. ${a.userId.name} (${a.userId.email}) - ${a.date.toDateString()} - ${a.status}`);
        });
        doc.end();
    } catch (error) {
        console.error('Export PDF error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Manually trigger auto punch-out (for testing)
// @route   POST /api/admin/trigger-auto-punchout
// @access  Private (Admin)
exports.triggerManualAutoPunchOut = async (req, res) => {
    try {
        const result = await triggerAutoPunchOut();
        if (result.success) {
            sendResponse(res, 200, true, result.message, { count: result.count });
        } else {
            sendError(res, 500, result.message);
        }
    } catch (error) {
        console.error('Trigger auto punch-out error:', error);
        sendError(res, 500, 'Server error', error);
    }
};
