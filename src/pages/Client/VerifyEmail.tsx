import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "@/api";

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const [countdown, setCountdown] = useState(3);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            toast.error('Không tìm thấy token xác thực.', { autoClose: 1200 });
            return;
        }

        const controller = new AbortController();

        api
            .get('/auth/verify-email', {
                params: { token },
                signal: controller.signal,
            })
            .then((res) => {
                const data = res.data;
                toast.success(data.message || 'Xác thực thành công!', { autoClose: 1200 });

                if (data.redirectTo) {
                    setRedirectTo(data.redirectTo);
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
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
                if (error.name === 'CanceledError') {
                    console.log('Request aborted — ignore.');
                    return;
                }
                console.error(error);
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra!', { autoClose: 1200 });
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
