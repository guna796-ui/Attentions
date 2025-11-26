import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await api.get('/leave/all');
            console.log('Leaves response:', res.data);
            const leavesData = res.data.data?.leaves || res.data.data || [];
            setLeaves(Array.isArray(leavesData) ? leavesData : []);
        } catch (err) {
            console.error('Error fetching leaves:', err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await api.put(`/leave/${id}/${action}`);
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing request');
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-6">Leave Requests</h2>

            <div className="space-y-4">
                {leaves.map(leave => (
                    <div key={leave._id} className="border p-4 rounded bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold text-lg">{leave.userId?.name || 'Unknown Employee'}</div>
                                <div className="text-gray-500 text-sm mb-2">{leave.userId?.department}</div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium capitalize">{leave.leaveType}</span>

                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </span>

                                    <span className="text-gray-600">Days:</span>
                                    <span className="font-medium">{leave.totalDays} {leave.halfDay ? '(Half Day)' : ''}</span>
                                </div>
                                <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
                                    <span className="font-medium">Reason: </span>
                                    {leave.reason}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {leave.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(leave._id, 'approve')}
                                            className="btn btn-primary bg-green-600 hover:bg-green-700 text-sm px-4"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(leave._id, 'reject')}
                                            className="btn btn-danger text-sm px-4"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                <span className={`px-2 py-1 rounded text-center text-xs font-medium uppercase
                                    ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {leave.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {leaves.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">No pending leave requests</div>
                )}
            </div>
        </div>
    );
};

export default LeaveApproval;
