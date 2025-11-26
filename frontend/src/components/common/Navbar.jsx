import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header className="header">
            <div className="container nav-content">
                <Link to={user.role === 'admin' ? '/admin' : '/employee'} className="logo">
                    Attendance System
                </Link>
                <nav className="nav-links">
                    {user.role === 'employee' && (
                        <>
                            <Link to="/employee" className="btn">Dashboard</Link>
                            <Link to="/employee/profile" className="btn">Profile</Link>
                        </>
                    )}
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin" className="btn">Dashboard</Link>
                            <Link to="/admin/employees" className="btn">Employees</Link>
                            <Link to="/admin/leave-types" className="btn">Leave Types</Link>
                        </>
                    )}
                    <button onClick={handleLogout} className="btn btn-danger">
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
