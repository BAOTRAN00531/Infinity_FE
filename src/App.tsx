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
import PurchasePage from "@/components/payment/PurchasePage";
import InvoicePage from "@/components/payment/InvoicePage";
import ClientCourseList from "@/pages/Learning/ClientCourseList";
import CourseDetail from "@/pages/Learning/CourseDetail";
import OrderHistoryPage from "@/components/history/OrderHistoryPage";
import Breadcrumbs from './components/Breadcrumbs';


// ✅ Logic trong App.tsx (bổ sung allowedPaths)
const App: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const isSession = !localStorage.getItem('access_token') && sessionStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const role = decodedToken.role;

                if (isSession) {
                    toast.success('🎉 Đăng nhập thành công!', {
                        autoClose: 1200, // 👈 1.2 giây riêng lẻ
                    });
                }

                if (role === 'ROLE_ADMIN') {
                    navigate('/admin/dashboard');
                } else if (role !== 'ROLE_ADMIN' && location.pathname === '/admin/dashboard') {
                    navigate('/');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('access_token');
                navigate('/');
            }
        } else {
            const allowedPaths = [
                '/', '/login', '/register', '/forgot-password',
                '/verify-otp', '/reset-password',
                '/buy', '/payment-success', '/verify-email', '/khoa-hoc'
            ];

            // if (!allowedPaths.includes(location.pathname)) {
            //     navigate('/');
            // }
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

        {/*<Route path="/khoa-hoc" element={<ClientCourseList />} />*/}


        <Route path="/client/course" element={<ClientCourseList />} />
        <Route path="/client/course/:id" element={<CourseDetail />} />


        <Route path="/verify-confirmation" element={<VerifyConfirmation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/invoice" element={<InvoicePage />} />

        <Route path="/order-history" element={<OrderHistoryPage />} />


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
                                        const token = localStorage.getItem('access_token'); sessionStorage.getItem('access_token');
                                        if (!token) {
                                            toast.error('Missing token', {
                                                autoClose: 1200, // 👈 1.2 giây riêng lẻ
                                            });
                                            return;
                                        }
                                        fetch('http://localhost:8080/api/languages', {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` },
                                            body: formData,
                                        }).then(() => {
                                            toast.success('Created!', {
                                                autoClose: 1200, // 👈 1.2 giây riêng lẻ
                                            });
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