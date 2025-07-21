import React from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children?: React.ReactNode; // Thêm hỗ trợ children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token: string | null = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let decodedToken: any;
    try {
        decodedToken = jwtDecode(token);
    } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('access_token');
        return <Navigate to="/login" replace />;
    }

    const role: string = decodedToken.role;

    if (!allowedRoles.includes(role)) {
        if (location.pathname !== '/user/dashboard') {
            window.location.href = '/user/dashboard';
        }
        return null;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;