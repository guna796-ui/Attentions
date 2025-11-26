import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmployeeManagement from './EmployeeManagement';
import AttendanceReports from './AttendanceReports';
import LeaveApproval from './LeaveApproval';
import HolidayManagement from './HolidayManagement';
import LeaveTypeManagement from './LeaveTypeManagement';
import AutoPunchOut from './AutoPunchOut';

const AdminDashboardHome = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/admin/employees" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Employees</h3>
                <p className="text-gray-500">Manage employee accounts and details</p>
            </Link>
            <Link to="/admin/attendance" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Attendance</h3>
                <p className="text-gray-500">View attendance reports and logs</p>
            </Link>
            <Link to="/admin/leaves" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">Leave Requests</h3>
                <p className="text-gray-500">Approve or reject leave applications</p>
            </Link>
            <Link to="/admin/holidays" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">Holidays</h3>
                <p className="text-gray-500">Manage government and optional holidays</p>
            </Link>
            <Link to="/admin/auto-punchout" className="card hover:shadow-lg transition-shadow cursor-pointer block">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-bold mb-2">Auto Punch-Out</h3>
                <p className="text-gray-500">Manage automatic punch-out settings</p>
            </Link>
        </div>
    );
};

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
                            <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
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
                                    to="/admin"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    🏠 Dashboard
                                </Link>
                                <Link
                                    to="/admin/employees"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/employees')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    👥 Employees
                                </Link>
                                <Link
                                    to="/admin/attendance"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/attendance')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📊 Attendance
                                </Link>
                                <Link
                                    to="/admin/leaves"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/leaves')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📝 Leave Requests
                                </Link>
                                <Link
                                    to="/admin/holidays"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/holidays')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    🎉 Holidays
                                </Link>
                                <Link
                                    to="/admin/leave-types"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/leave-types')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    ⚙️ Leave Types
                                </Link>
                                <Link
                                    to="/admin/auto-punchout"
                                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/auto-punchout')
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    🔄 Auto Punch-Out
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Routes>
                            <Route path="/" element={<AdminDashboardHome />} />
                            <Route path="/employees" element={<EmployeeManagement />} />
                            <Route path="/attendance" element={<AttendanceReports />} />
                            <Route path="/leaves" element={<LeaveApproval />} />
                            <Route path="/holidays" element={<HolidayManagement />} />
                            <Route path="/leave-types" element={<LeaveTypeManagement />} />
                            <Route path="/auto-punchout" element={<AutoPunchOut />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
