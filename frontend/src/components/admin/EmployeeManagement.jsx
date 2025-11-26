import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        designation: '',
        role: 'employee'
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/employees');
            console.log('Employees response:', res.data);
            const employeesData = res.data.data?.employees || res.data.data || [];
            setEmployees(Array.isArray(employeesData) ? employeesData : []);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setEmployees([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            setShowForm(false);
            fetchEmployees();
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                department: '',
                designation: '',
                role: 'employee'
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating employee');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await api.delete(`/admin/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Employee Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancel' : 'Add Employee'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-4 bg-gray-50 rounded border">
                    <h3 className="font-bold mb-4">Add New Employee</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Designation</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <button type="submit" className="btn btn-primary w-full">Create Employee</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Email</th>
                            <th className="p-3 border-b">Department</th>
                            <th className="p-3 border-b">Designation</th>
                            <th className="p-3 border-b">Role</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp._id} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-medium">{emp.name}</td>
                                <td className="p-3 border-b">{emp.email}</td>
                                <td className="p-3 border-b">{emp.department}</td>
                                <td className="p-3 border-b">{emp.designation}</td>
                                <td className="p-3 border-b capitalize">{emp.role}</td>
                                <td className="p-3 border-b">
                                    <button
                                        onClick={() => handleDelete(emp._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && !loading && (
                    <div className="text-center py-4 text-gray-500">No employees found</div>
                )}
            </div>
        </div>
    );
};

export default EmployeeManagement;
