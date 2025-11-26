const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendResponse, sendError } = require('../utils/helpers');
const LeaveType = require('../models/LeaveType');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return sendError(res, 400, 'Please provide email and password');
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            return sendError(res, 401, 'Your account has been deactivated. Please contact admin.');
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        const userResponse = user.toJSON();

        sendResponse(res, 200, true, 'Login successful', {
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 500, 'Server error during login', error);
    }
};

// @desc    Register new user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role, department, designation, joiningDate } = req.body;

        // Validate input
        if (!name || !email || !phone || !password || !department || !designation) {
            return sendError(res, 400, 'Please provide all required fields');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendError(res, 400, 'User with this email already exists');
        }

        // Fetch active leave types for initial balance
        const leaveTypes = await LeaveType.find({ isActive: true });
        const initialBalance = {};
        leaveTypes.forEach(type => {
            initialBalance[type.code] = type.defaultDays;
        });

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: role || 'employee',
            department,
            designation,
            joiningDate: joiningDate || Date.now(),
            leaveBalance: initialBalance
        });

        sendResponse(res, 201, true, 'User registered successfully', {
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Registration error:', error);
        sendError(res, 500, 'Server error during registration', error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        sendResponse(res, 200, true, 'User profile retrieved', {
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, emergencyContact } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (emergencyContact) updateData.emergencyContact = emergencyContact;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        sendResponse(res, 200, true, 'Profile updated successfully', {
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        sendError(res, 500, 'Server error', error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return sendError(res, 400, 'Please provide current and new password');
        }

        if (newPassword.length < 6) {
            return sendError(res, 400, 'New password must be at least 6 characters');
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return sendError(res, 401, 'Current password is incorrect');
        }

        // Update password
        user.password = newPassword;
        await user.save();

        sendResponse(res, 200, true, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        sendError(res, 500, 'Server error', error);
    }
};
