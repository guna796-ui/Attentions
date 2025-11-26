import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LeaveApplication = () => {
    const [leaves, setLeaves] = useState([]);
    const [balance, setBalance] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        halfDay: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchLeaves();
        fetchBalance();
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const res = await api.get('/leave-types');
            setLeaveTypes(res.data.data);
            if (res.data.data.length > 0) {
                setFormData(prev => ({ ...prev, leaveType: res.data.data[0].code.toLowerCase() }));
            }
        } catch (err) {
            console.error('Error fetching leave types:', err);
        }
    };

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leave/my-leaves');
            const leavesData = res.data.data?.leaves || res.data.data || [];
            setLeaves(Array.isArray(leavesData) ? leavesData : []);
        } catch (err) {
            console.error('Error fetching leaves:', err);
            setLeaves([]);
        }
    };

    const fetchBalance = async () => {
        try {
            const res = await api.get('/leave/balance');
            setBalance(res.data.data?.leaveBalance || res.data.data || null);
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/leave/apply', formData);
            setMessage({ type: 'success', text: 'Leave application submitted successfully' });
            fetchLeaves();
            setFormData(prev => ({
                ...prev,
                startDate: '',
                endDate: '',
                reason: '',
                halfDay: false
            }));
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error submitting application' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
                {message.text && (
                    <div className={`p-3 rounded mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select
                            className="form-input"
                            value={formData.leaveType}
                            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                        >
                            {leaveTypes.map(type => (
                                <option key={type._id} value={type.code.toLowerCase()}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <textarea
                            className="form-input"
                            rows="3"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.halfDay}
                                onChange={(e) => setFormData({ ...formData, halfDay: e.target.checked })}
                            />
                            Half Day
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Apply Leave'}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                {balance && leaveTypes.length > 0 && (
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {leaveTypes.map(type => (
                                <div
                                    key={type._id}
                                    className="p-3 rounded"
                                    style={{ backgroundColor: `var(--color-${type.color}-50, #f3f4f6)` }}
                                >
                                    <div className="text-sm text-gray-600">{type.name}</div>
                                    <div className="text-xl font-bold">
                                        {balance[type.code] !== undefined ? balance[type.code] : balance[type.code.toLowerCase()] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
                    <div className="space-y-4">
                        {leaves.map((leave) => (
                            <div key={leave._id} className="border-b pb-2 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium capitalize">{leave.leaveType} Leave</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                                        ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {leave.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {leaves.length === 0 && <div className="text-gray-500 text-center">No recent applications</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;
