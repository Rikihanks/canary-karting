import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminGuard = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><i className="fa-solid fa-spinner fa-spin fa-2x"></i></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.isAdmin && !user.itsAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminGuard;
