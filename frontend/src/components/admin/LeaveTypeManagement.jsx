import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';

const LeaveTypeManagement = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        defaultDays: 12,
        color: 'blue'
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const colors = [
        { name: 'Blue', value: 'blue' },
        { name: 'Green', value: 'green' },
        { name: 'Purple', value: 'purple' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Red', value: 'red' },
        { name: 'Indigo', value: 'indigo' },
        { name: 'Pink', value: 'pink' },
        { name: 'Gray', value: 'gray' }
    ];

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const res = await api.get('/leave-types/all');
            setLeaveTypes(res.data.data);
        } catch (err) {
            console.error('Error fetching leave types:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingId) {
                await api.put(`/leave-types/${editingId}`, formData);
                setMessage({ type: 'success', text: 'Leave type updated successfully' });
            } else {
                await api.post('/leave-types', formData);
                setMessage({ type: 'success', text: 'Leave type created successfully' });
            }
            fetchLeaveTypes();
            handleCloseModal();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving leave type' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this leave type?')) return;

        try {
            await api.delete(`/leave-types/${id}`);
            setMessage({ type: 'success', text: 'Leave type deleted successfully' });
            fetchLeaveTypes();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error deleting leave type' });
        }
    };

    const handleEdit = (type) => {
        setFormData({
            name: type.name,
            code: type.code,
            description: type.description || '',
            defaultDays: type.defaultDays,
            color: type.color
        });
        setEditingId(type._id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            name: '',
            code: '',
            description: '',
            defaultDays: 12,
            color: 'blue'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Leave Types Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Leave Type
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaveTypes.map((type) => (
                    <div key={type._id} className={`card border-l-4 border-${type.color}-500`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{type.name}</h3>
                                <span className="text-sm text-gray-500 font-mono">{type.code}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(type)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(type._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Default Balance:</span>
                                <span className="font-bold">{type.defaultDays} days/year</span>
                            </div>
                            {type.description && (
                                <p className="text-sm text-gray-500">{type.description}</p>
                            )}
                        </div>

                        <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {type.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                {editingId ? 'Edit Leave Type' : 'Add New Leave Type'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Sick Leave"
                                />
                            </div>
                            <div>
                                <label className="form-label">Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    required
                                    placeholder="e.g. SICK"
                                />
                            </div>
                            <div>
                                <label className="form-label">Default Days (per year)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.defaultDays}
                                    onChange={(e) => setFormData({ ...formData, defaultDays: parseInt(e.target.value) })}
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="form-label">Color Theme</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {colors.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: c.value })}
                                            className={`h-8 rounded-full border-2 transition-all ${formData.color === c.value ? 'border-black scale-110' : 'border-transparent'
                                                }`}
                                            style={{ backgroundColor: `var(--color-${c.value}-100, ${c.value})` }}
                                            title={c.name}
                                        >
                                            <div className={`w-full h-full rounded-full bg-${c.value}-500 opacity-50`}></div>
                                        </button>
                                    ))}
                                </div>
                                <select
                                    className="form-input mt-2"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                >
                                    {colors.map(c => (
                                        <option key={c.value} value={c.value}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows="2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveTypeManagement;
