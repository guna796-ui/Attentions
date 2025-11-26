import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/common/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import EmployeeDashboard from './components/employee/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Employee routes */}
            <Route
                path="/employee/*"
                element={
                    <ProtectedRoute requiredRole="employee">
                        <EmployeeDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Admin routes */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Default redirect */}
            <Route
                path="*"
                element={
                    user ? (
                        <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
