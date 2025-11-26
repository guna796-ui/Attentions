const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { addHoliday, getHolidays, deleteHoliday } = require('../controllers/holidayController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/', addHoliday);
router.get('/', getHolidays);
router.delete('/:id', deleteHoliday);

module.exports = router;
