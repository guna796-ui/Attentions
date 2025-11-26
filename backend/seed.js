const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@company.com',
            phone: '+1234567890',
            password: 'admin123',
            role: 'admin',
            department: 'Administration',
            designation: 'System Administrator',
            joiningDate: new Date('2024-01-01')
        });
        console.log('Admin user created:', admin.email);

        // Create employee user
        const employee = await User.create({
            name: 'John Doe',
            email: 'employee@company.com',
            phone: '+1234567891',
            password: 'employee123',
            role: 'employee',
            department: 'IT',
            designation: 'Software Developer',
            joiningDate: new Date('2024-06-01')
        });
        console.log('Employee user created:', employee.email);

        console.log('\n✅ Database seeded successfully!');
        console.log('\nDemo Credentials:');
        console.log('Admin: admin@company.com / admin123');
        console.log('Employee: employee@company.com / employee123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedUsers();
