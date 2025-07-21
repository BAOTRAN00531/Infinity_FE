import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const [countdown, setCountdown] = useState(3);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            toast.error('Không tìm thấy token xác thực.');
            return;
        }

        const controller = new AbortController();

        fetch(`http://localhost:8080/auth/verify-email?token=${token}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message);
                    });
                }
                return response.json();
            })
            .then((data) => {
                toast.success(data.message || 'Xác thực thành công!');

                if (data.redirectTo) {
                    setRedirectTo(data.redirectTo);

                    const timer = setInterval(() => {
                        setCountdown(prev => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate(data.redirectTo);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    console.log('Request aborted — ignore.');
                    return;
                }
                console.error(error);
                toast.error(error.message || 'Có lỗi xảy ra!');
            });

        return () => controller.abort();
    }, [token, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Xác nhận email</h2>

            {redirectTo && (
                <p>Chuyển hướng đến trang đăng nhập sau {countdown} giây...</p>
            )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default VerifyEmail;
