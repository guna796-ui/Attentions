import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!user) return <div>Loading...</div>;

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setIsModalOpen(false), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-500">{user.designation}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {user.department}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="text-sm text-gray-500">Email Address</label>
                        <div className="font-medium text-lg">{user.email}</div>
                    </div>
                    <div className="form-group">
                        <label className="text-sm text-gray-500">Employee ID</label>
                        <div className="font-medium text-lg">{user._id}</div>
                    </div>
                    <div className="form-group">
                        <label className="text-sm text-gray-500">Role</label>
                        <div className="font-medium text-lg capitalize">{user.role}</div>
                    </div>
                    <div className="form-group">
                        <label className="text-sm text-gray-500">Joining Date</label>
                        <div className="font-medium text-lg">
                            {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-bold mb-4">Account Settings</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn border border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Change Password Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>

                        {message.text && (
                            <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handleChange}
                                    className="input w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="input w-full"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="input w-full"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setMessage({ type: '', text: '' });
                                        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="btn flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary flex-1"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
