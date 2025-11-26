import React, { useState } from 'react';
import api from '../../services/api';

const AutoPunchOut = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTriggerAutoPunchOut = async () => {
        if (!window.confirm('Are you sure you want to trigger auto punch-out for all employees who forgot to punch out today?')) {
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await api.post('/admin/trigger-auto-punchout');
            setResult(res.data.data);
            alert(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Error triggering auto punch-out');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Auto Punch-Out Management</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">ℹ️ About Auto Punch-Out</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automatically runs every day at <strong>11:30 PM</strong></li>
                    <li>• Punches out employees who forgot to punch out</li>
                    <li>• Sets punch-out time to 11:30 PM</li>
                    <li>• Calculates working hours automatically</li>
                </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Manual Trigger</h3>
                <p className="text-sm text-yellow-800 mb-3">
                    Use this button to manually trigger auto punch-out for testing purposes.
                    This will punch out all employees who have punched in but not punched out today.
                </p>
                <button
                    onClick={handleTriggerAutoPunchOut}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Processing...' : '🔄 Trigger Auto Punch-Out Now'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-2">✅ Success</h3>
                    <p className="text-green-800">
                        Auto punched-out <strong>{result.count}</strong> employee{result.count !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-3">Scheduled Job Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Schedule</div>
                        <div className="font-bold">Daily at 11:30 PM</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Timezone</div>
                        <div className="font-bold">Asia/Kolkata (IST)</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Status</div>
                        <div className="font-bold text-green-600">● Active</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Next Run</div>
                        <div className="font-bold">Today at 11:30 PM</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoPunchOut;
