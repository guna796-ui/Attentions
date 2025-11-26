import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const HolidayManagement = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        type: 'government',
        description: ''
    });

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const res = await api.get('/holiday');
            console.log('Holidays response:', res.data);
            const holidaysData = res.data.data?.holidays || res.data.data || [];
            setHolidays(Array.isArray(holidaysData) ? holidaysData : []);
        } catch (err) {
            console.error('Error fetching holidays:', err);
            setHolidays([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/holiday', formData);
            fetchHolidays();
            setFormData({
                name: '',
                date: '',
                type: 'government',
                description: ''
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding holiday');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this holiday?')) return;
        try {
            await api.delete(`/holiday/${id}`);
            fetchHolidays();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Add Holiday</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Holiday Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                className="form-input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="government">Government</option>
                                <option value="optional">Optional</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Add Holiday</button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Holiday List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 border-b">Date</th>
                                    <th className="p-3 border-b">Name</th>
                                    <th className="p-3 border-b">Type</th>
                                    <th className="p-3 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.map(holiday => (
                                    <tr key={holiday._id} className="hover:bg-gray-50">
                                        <td className="p-3 border-b">
                                            {new Date(holiday.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 border-b font-medium">{holiday.name}</td>
                                        <td className="p-3 border-b capitalize">
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${holiday.type === 'government' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {holiday.type}
                                            </span>
                                        </td>
                                        <td className="p-3 border-b">
                                            <button
                                                onClick={() => handleDelete(holiday._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {holidays.length === 0 && !loading && (
                            <div className="text-center py-4 text-gray-500">No holidays added yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayManagement;
