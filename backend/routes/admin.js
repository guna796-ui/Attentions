const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getAttendanceReport,
    getPayrollSummary,
    exportCsv,
    exportPdf,
    triggerManualAutoPunchOut
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Employee management
router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Attendance reports
router.get('/attendance-report', getAttendanceReport);
router.get('/payroll-summary', getPayrollSummary);

// Export
router.get('/export/csv', exportCsv);
router.get('/export/pdf', exportPdf);

// Auto punch-out
router.post('/trigger-auto-punchout', triggerManualAutoPunchOut);

module.exports = router;
