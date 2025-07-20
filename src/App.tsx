import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import VerifySuccess from './pages/VerifySuccess';
import Index from './pages/Index';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyConfirmation from './pages/VerifyConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import LanguageList from './pages/LanguageList';
import LanguageForm from './pages/LanguageForm';
import { jwtDecode } from 'jwt-decode';


import LoadingIndicator from 'components/loading-page/LoadingIndicator'

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:8080/auth/verify-email?token=${token}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => {
                    if (response.status === 303) {
                        navigate('/verify-success');
                    } else {
                        response.json().then((data) => alert(data.message));
                    }
                })
                .catch((error) => alert('Lỗi khi xác thực: ' + error.message));
        }
    }, [token, navigate]);

    return <div>Đang xử lý xác thực...</div>;
};

const App: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const role = decodedToken.role;

                // Kiểm tra vai trò và điều hướng ngay cả khi không ở '/'
                if (role === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard');
                } else if (role !== 'ROLE_ADMIN' && location.pathname !== '/') {
                    navigate('/');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('access_token');
                navigate('/');
            }
        } else if (
            location.pathname !== '/' &&
            location.pathname !== '/login' &&
            location.pathname !== '/register' &&
            location.pathname !== '/forgot-password' &&
            location.pathname !== '/verify-otp' && // Đã thêm
            location.pathname !== '/reset-password' // Đã thêm
        ) {
            navigate('/');
        }
    }, [navigate, location.pathname]);
    return (
        <div>
        <LoadingIndicator />
    <Routes>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-success" element={<VerifySuccess />} />
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-confirmation" element={<VerifyConfirmation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route
                path="/admin/dashboard"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}
            >
                <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="/languages" element={<LanguageList />} />
            <Route
                path="/languages/create"
                element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <Route
                            path="/languages/create"
                            element={
                            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                                <LanguageForm
                                    onSubmit={(formData) => {
                                        const token = localStorage.getItem('access_token');
                                        if (!token) return alert('Missing token');
                                        fetch('http://localhost:8080/api/languages', {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` },
                                            body: formData,
                                        }).then(() => {
                                            alert('Created!');
                                            window.location.href = '/languages';
                                        });
                                    }}
                                    onCancel={() => window.location.href = '/languages'} // ✅ Thêm dòng này
                                />
                            </ProtectedRoute>
                        }
                            />
                    </ProtectedRoute>
                }
            />
        </Routes>
            </div>
    );
};

export default App;