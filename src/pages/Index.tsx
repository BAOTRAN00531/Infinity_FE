import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authService';

const Index: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('access_token');
        document.cookie = 'refresh_token=; Max-Age=0; path=/';
        navigate('/login');
    };

    if (!token) return null;

    return (
        <div>
            <h1>Trang chủ</h1>
            <p>Chào mừng bạn đã đăng nhập!</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
};

export default Index;