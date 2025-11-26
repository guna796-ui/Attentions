const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Initialize cron jobs
const { autoPunchOutJob } = require('./jobs/autoPunchOut');
console.log('Auto punch-out job scheduled for 11:30 PM daily');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/holiday', require('./routes/holiday'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leave-types', require('./routes/leaveType'));

// Default route
app.get('/', (req, res) => {
    res.send('Attendance & Leave Management API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
