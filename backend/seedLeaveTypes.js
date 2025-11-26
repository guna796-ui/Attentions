const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LeaveType = require('./models/LeaveType');

dotenv.config();

const leaveTypes = [
    {
        name: 'Sick Leave',
        code: 'SICK',
        description: 'For medical emergencies and health-related absences',
        defaultDays: 12,
        color: 'blue',
        isActive: true
    },
    {
        name: 'Casual Leave',
        code: 'CASUAL',
        description: 'For personal matters and short-term absences',
        defaultDays: 12,
        color: 'green',
        isActive: true
    },
    {
        name: 'Earned Leave',
        code: 'EARNED',
        description: 'Accumulated leave earned over time',
        defaultDays: 15,
        color: 'purple',
        isActive: true
    },
    {
        name: 'Optional Leave',
        code: 'OPTIONAL',
        description: 'Optional holidays for festivals and special occasions',
        defaultDays: 3,
        color: 'yellow',
        isActive: true
    }
];

const seedLeaveTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected');

        // Clear existing leave types
        await LeaveType.deleteMany({});
        console.log('Cleared existing leave types');

        // Insert new leave types
        const created = await LeaveType.insertMany(leaveTypes);
        console.log(`Created ${created.length} leave types:`);
        created.forEach(lt => {
            console.log(`  - ${lt.name} (${lt.code}): ${lt.defaultDays} days`);
        });

        console.log('\n✅ Leave types seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding leave types:', error);
        process.exit(1);
    }
};

seedLeaveTypes();
