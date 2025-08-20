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
import UserDashboard from './pages/Student/UserDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import LanguageList from './pages/Admin/LanguageList';
import LanguageForm from './pages/Admin/LanguageForm';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import VerifyEmail from './pages/Client/VerifyEmail';
import 'react-toastify/dist/ReactToastify.css';
import LoadingIndicator from 'components/loading-page/LoadingIndicator';
import OAuth2RedirectHandler from "@/components/auth/OAuth2RedirectHandler";
import PurchasePage from "@/components/payment/PurchasePage";
import InvoicePage from "@/components/payment/InvoicePage";
import ClientCourseList from "@/pages/Learning/ClientCourseList";
import CourseDetail from "@/pages/Learning/CourseDetail";
import OrderHistoryPage from "@/components/history/OrderHistoryPage";
import StudentCourses from "@/pages/Student/StudentCourses";
import SePayPaymentPage from "@/components/payment/SePayPaymentPage";
import NotFoundPage from "@/pages/Client/NotFoundPage";
import LanguageSelection from "@/pages/Client/LanguageSelection";

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
                    toast.success('🎉 Đăng nhập thành công!', { autoClose: 1200 });
                }

                if (role === 'ROLE_ADMIN' && !location.pathname.startsWith('/admin')) {
                    // Chuyển hướng đến admin dashboard nếu là admin và chưa ở trang admin
                    navigate('/admin/dashboard');
                } else if (role !== 'ROLE_ADMIN' && location.pathname.startsWith('/admin')) {
                    // Chuyển hướng về trang chủ nếu không phải admin nhưng cố truy cập trang admin
                    navigate('/');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('access_token');
                sessionStorage.removeItem('access_token');
                navigate('/login'); // Chuyển hướng về trang đăng nhập
            }
        }
    }, [navigate, location.pathname]);

    return (
        <div>
            <LoadingIndicator />
            <Routes>
                {/* Routes công khai cho tất cả mọi người */}
                <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-success" element={<VerifySuccess />} />
                <Route path="/" element={<IndexClient />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Route chính để chọn ngôn ngữ */}
                <Route path="/client/course" element={<LanguageSelection />} />

                {/* Route cho trang danh sách khóa học theo ngôn ngữ */}
                <Route path="/client/course/:languageName" element={<ClientCourseList />} />

                {/* ✅ Thay đổi đường dẫn để nó rõ ràng là trang chi tiết */}
                <Route path="/client/detail/:id" element={<CourseDetail />} />
                
                <Route path="/sepay-payment" element={<SePayPaymentPage />} />
                <Route path="/verify-confirmation" element={<VerifyConfirmation />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="/invoice" element={<InvoicePage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/student/course/:id" element={<StudentCourses />} />
                <Route path="/student/dashboard" element={<UserDashboard />} />

                {/* --- Routes được bảo vệ cho Admin --- */}
                {/* Đây là cú pháp đúng để lồng route.
                    <ProtectedRoute> sẽ đóng vai trò là "layout" hoặc "wrapper" cho các routes bên trong nó.
                    Nó sẽ kiểm tra quyền trước khi hiển thị component con.
                */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="languages" element={<LanguageList />} />
                    <Route path="languages/create" element={
                        <LanguageForm
                            onSubmit={(formData) => {
                                const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
                                if (!token) {
                                    toast.error('Missing token', { autoClose: 1200 });
                                    return;
                                }
                                fetch('http://localhost:8080/api/languages', {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` },
                                    body: formData,
                                }).then(() => {
                                    toast.success('Created!', { autoClose: 1200 });
                                    setTimeout(() => {
                                        window.location.href = '/admin/languages';
                                    }, 1500);
                                });
                            }}
                            onCancel={() => window.location.href = '/admin/languages'}
                        />
                    } />
                </Route>


                {/* ✅ Route 404. Phải đặt ở cuối cùng! */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
};

export default App;