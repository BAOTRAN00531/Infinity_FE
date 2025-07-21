import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [countdown, setCountdown] = useState(3);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:8080/auth/verify-email?token=${token}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => response.json())
                .then((data) => {
                    setMessage(data.message || 'Xác thực thất bại');
                    if (data.message === "Xác nhận thành công" && data.redirectTo) {
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
                .catch((error) => setMessage('Lỗi khi xác thực: ' + error.message));
        }
    }, [token, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Xác nhận email</h2>
            <p>{message}</p>
            {countdown > 0 && message === "Xác nhận thành công" && (
                <p>Chuyển hướng đến trang đăng nhập sau {countdown} giây...</p>
            )}
        </div>
    );
};

export default VerifyEmail;