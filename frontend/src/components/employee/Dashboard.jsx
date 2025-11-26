import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PunchInOut from './PunchInOut';
import LeaveApplication from './LeaveApplication';
import AttendanceCalendar from './AttendanceCalendar';
import Profile from './Profile';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Prezinko"
                                className="h-10"
                            />
                            <h1 className="text-2xl font-bold text-indigo-600">Attendance System</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <nav className="space-y-2">
                                <Link
                                    to="/employee"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/employee')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📍 Punch In/Out
                                </Link>
                                <Link
                                    to="/employee/leave"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/employee/leave')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📝 Leave Application
                                </Link>
                                <Link
                                    to="/employee/calendar"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/employee/calendar')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📅 Attendance Calendar
                                </Link>
                                <Link
                                    to="/employee/profile"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/employee/profile')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    👤 Profile
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Routes>
                            <Route path="/" element={<PunchInOut />} />
                            <Route path="/leave" element={<LeaveApplication />} />
                            <Route path="/calendar" element={<AttendanceCalendar />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
