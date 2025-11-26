import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';

const AttendanceCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, [currentDate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const res = await api.get('/attendance/my-attendance', {
                params: {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                }
            });
            console.log('Attendance response:', res.data);
            const attendanceArray = res.data.data || [];
            setAttendanceData(Array.isArray(attendanceArray) ? attendanceArray : []);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setAttendanceData([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const getStatusForDay = (day) => {
        try {
            const record = attendanceData.find(a => {
                if (!a.date) return false;
                try {
                    return isSameDay(parseISO(a.date), day);
                } catch {
                    return false;
                }
            });
            return record || null;
        } catch (err) {
            console.error('Error in getStatusForDay:', err);
            return null;
        }
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Attendance Calendar</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="btn btn-primary px-3">&lt;</button>
                    <span className="font-bold text-lg">{format(currentDate, 'MMMM yyyy')}</span>
                    <button onClick={() => changeMonth(1)} className="btn btn-primary px-3">&gt;</button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-bold py-2 bg-gray-100 rounded">
                            {day}
                        </div>
                    ))}

                    {/* Add empty cells for days before start of month if needed - simplified for now */}
                    {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                    ))}

                    {daysInMonth.map(day => {
                        const status = getStatusForDay(day);
                        let bgClass = 'bg-gray-50';
                        if (status) {
                            if (status.status === 'present') bgClass = 'bg-green-100 border-green-200';
                            else if (status.status === 'absent') bgClass = 'bg-red-100 border-red-200';
                            else if (status.status === 'half-day') bgClass = 'bg-yellow-100 border-yellow-200';
                            else if (status.status === 'late') bgClass = 'bg-orange-100 border-orange-200';
                        }

                        return (
                            <div
                                key={day.toString()}
                                className={`p-2 min-h-[80px] border rounded ${bgClass} ${isToday(day) ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                <div className="text-right text-sm font-medium mb-1">{format(day, 'd')}</div>
                                {status && (
                                    <div className="text-xs">
                                        <div className="font-bold capitalize text-gray-700">{status.status}</div>
                                        {status.punchIn && (
                                            <div className="text-gray-500 mt-1">
                                                In: {format(parseISO(status.punchIn), 'HH:mm')}
                                            </div>
                                        )}
                                        {status.punchOut && (
                                            <div className="text-gray-500">
                                                Out: {format(parseISO(status.punchOut), 'HH:mm')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-6 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                    <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                    <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span>Half Day</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                    <span>Late</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
