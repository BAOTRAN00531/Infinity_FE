import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import VerifySuccess from './pages/VerifySuccess';
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyConfirmation from "./pages/VerifyConfirmation";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
//đay là test githubbbbb nè
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
    return (
        <Router>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/verify-success" element={<VerifySuccess />} />
                <Route path="/" element={<Index/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-confirmation" element={<VerifyConfirmation />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* Các route khác */}
            </Routes>
        </Router>
    );
};

export default App;