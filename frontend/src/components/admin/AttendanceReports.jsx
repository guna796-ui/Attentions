import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const AttendanceReports = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchAttendance();
    }, [startDate, endDate]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const res = await api.get('/admin/attendance-report', {
                params: {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                }
            });
            console.log('Attendance response:', res.data);
            const records = res.data.data?.records || res.data.data || [];
            setAttendance(Array.isArray(records) ? records : []);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        if (attendance.length === 0) {
            alert('No data to download');
            return;
        }

        // Prepare data for Excel
        const excelData = attendance.map(record => ({
            'Employee Name': record.userId?.name || 'Unknown',
            'Email': record.userId?.email || '-',
            'Department': record.userId?.department || '-',
            'Date': format(new Date(record.date), 'dd-MMM-yyyy'),
            'Punch In': record.punchIn ? format(new Date(record.punchIn), 'HH:mm:ss') : '-',
            'Punch Out': record.punchOut ? format(new Date(record.punchOut), 'HH:mm:ss') : '-',
            'Status': record.status || '-',
            'Working Hours': record.workingHours ? record.workingHours.toFixed(2) : '0',
            'Late By (mins)': record.lateBy || '0',
            'Overtime (hrs)': record.overtime ? record.overtime.toFixed(2) : '0'
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const columnWidths = [
            { wch: 20 }, // Employee Name
            { wch: 25 }, // Email
            { wch: 15 }, // Department
            { wch: 12 }, // Date
            { wch: 10 }, // Punch In
            { wch: 10 }, // Punch Out
            { wch: 10 }, // Status
            { wch: 12 }, // Working Hours
            { wch: 12 }, // Late By
            { wch: 12 }  // Overtime
        ];
        worksheet['!cols'] = columnWidths;

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

        // Generate filename with date range
        const filename = `Attendance_Report_${startDate}_to_${endDate}.xlsx`;

        // Download
        XLSX.writeFile(workbook, filename);
    };

    const downloadCSV = () => {
        if (attendance.length === 0) {
            alert('No data to download');
            return;
        }

        // Prepare CSV data
        const headers = ['Employee Name', 'Email', 'Department', 'Date', 'Punch In', 'Punch Out', 'Status', 'Working Hours', 'Late By (mins)', 'Overtime (hrs)'];
        const csvData = attendance.map(record => [
            record.userId?.name || 'Unknown',
            record.userId?.email || '-',
            record.userId?.department || '-',
            format(new Date(record.date), 'dd-MMM-yyyy'),
            record.punchIn ? format(new Date(record.punchIn), 'HH:mm:ss') : '-',
            record.punchOut ? format(new Date(record.punchOut), 'HH:mm:ss') : '-',
            record.status || '-',
            record.workingHours ? record.workingHours.toFixed(2) : '0',
            record.lateBy || '0',
            record.overtime ? record.overtime.toFixed(2) : '0'
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Attendance_Report_${startDate}_to_${endDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-6">Attendance Report</h2>

            {/* Filters and Download Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            className="form-input w-full"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            className="form-input w-full"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            onClick={downloadExcel}
                            disabled={loading || attendance.length === 0}
                            className="btn btn-primary w-full"
                        >
                            📥 Download Excel
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={downloadCSV}
                            disabled={loading || attendance.length === 0}
                            className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                            📄 Download CSV
                        </button>
                    </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                    Showing {attendance.length} record{attendance.length !== 1 ? 's' : ''} from {format(new Date(startDate), 'dd MMM yyyy')} to {format(new Date(endDate), 'dd MMM yyyy')}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Employee</th>
                            <th className="p-3 border-b">Date</th>
                            <th className="p-3 border-b">Punch In</th>
                            <th className="p-3 border-b">Punch Out</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Working Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map(record => (
                            <tr key={record._id} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-medium">
                                    <div>{record.userId?.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{record.userId?.department || '-'}</div>
                                </td>
                                <td className="p-3 border-b">
                                    {format(new Date(record.date), 'dd MMM yyyy')}
                                </td>
                                <td className="p-3 border-b">
                                    {record.punchIn ? format(new Date(record.punchIn), 'HH:mm:ss') : '-'}
                                </td>
                                <td className="p-3 border-b">
                                    {record.punchOut ? format(new Date(record.punchOut), 'HH:mm:ss') : '-'}
                                </td>
                                <td className="p-3 border-b capitalize">
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                                        ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="p-3 border-b">
                                    {record.workingHours ? record.workingHours.toFixed(2) + ' hrs' : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {attendance.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">No attendance records for this date range</div>
                )}
                {loading && (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                )}
            </div>
        </div>
    );
};

export default AttendanceReports;
