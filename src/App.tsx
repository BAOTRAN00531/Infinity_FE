import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import VerifySuccess from './pages/Client/VerifySuccess';
import IndexClient from './pages/IndexClient';
import Register from './pages/Client/Register';
import Login from './pages/Client/Login';
import VerifyConfirmation from './pages/Client/VerifyConfirmation';
import ForgotPassword from './pages/Client/ForgotPassword';
import VerifyOtp from './pages/Client/VerifyOtp';
import ResetPassword from './pages/Client/ResetPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/Admin/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import LanguageList from './pages/Admin/LanguageList';
import LanguageForm from './pages/Admin/LanguageForm';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import VerifyEmail from './pages/Client/VerifyEmail';
import 'react-toastify/dist/ReactToastify.css';
import LoadingIndicator from 'components/loading-page/LoadingIndicator'
import OAuth2RedirectHandler from "@/components/auth/OAuth2RedirectHandler";



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
        <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />

            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-success" element={<VerifySuccess />} />
            <Route path="/" element={<IndexClient />} />
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
                                        if (!token) {
                                            toast.error('Missing token');
                                            return;
                                        }
                                        fetch('http://localhost:8080/api/languages', {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` },
                                            body: formData,
                                        }).then(() => {
                                            toast.success('Created!');
                                            setTimeout(() => {
                                                window.location.href = '/languages';
                                            }, 1500);
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