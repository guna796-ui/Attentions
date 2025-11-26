import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PunchInOut = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchTodayStatus();
        return () => clearInterval(timer);
    }, []);

    const fetchTodayStatus = async () => {
        try {
            const res = await api.get('/attendance/today');
            console.log('Today status response:', res.data);
            // Backend returns { data: { status, attendance } }
            const responseData = res.data.data || res.data;
            // Use the attendance object, not the status string
            const attendanceData = responseData.attendance || null;
            console.log('Attendance data:', attendanceData);
            setStatus(attendanceData);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error fetching status:', err);
            setStatus(null);
        }
    };

    const handlePunch = async (type) => {
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    const endpoint = type === 'in' ? '/attendance/punch-in' : '/attendance/punch-out';
                    const res = await api.post(endpoint, { location });
                    console.log('Punch response:', res.data);
                    // Backend returns { data: { attendance } }
                    const responseData = res.data.data || res.data;
                    const attendanceData = responseData.attendance || responseData;
                    setStatus(attendanceData);
                } catch (err) {
                    setError(err.response?.data?.message || 'Error processing request');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <div className="card max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Daily Attendance</h2>
            <div className="text-4xl font-mono mb-8">
                {currentTime.toLocaleTimeString()}
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex justify-center gap-4">
                {!status?.punchIn ? (
                    <button
                        onClick={() => handlePunch('in')}
                        disabled={loading}
                        className="btn btn-primary text-lg px-8 py-3"
                    >
                        {loading ? 'Processing...' : 'Punch In'}
                    </button>
                ) : !status?.punchOut ? (
                    <button
                        onClick={() => handlePunch('out')}
                        disabled={loading}
                        className="btn btn-danger text-lg px-8 py-3"
                    >
                        {loading ? 'Processing...' : 'Punch Out'}
                    </button>
                ) : (
                    <div className="text-green-600 font-bold">
                        Attendance Completed for Today
                    </div>
                )}
            </div>

            {status && (
                <div className="mt-8 text-left">
                    <div className="flex justify-between border-b py-2">
                        <span>Punch In:</span>
                        <span className="font-mono">
                            {status.punchIn ? new Date(status.punchIn).toLocaleTimeString() : '--:--'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Punch Out:</span>
                        <span className="font-mono">
                            {status.punchOut ? new Date(status.punchOut).toLocaleTimeString() : '--:--'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PunchInOut;
