import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authService';

const Index: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('access_token');
        document.cookie = 'refresh_token=; Max-Age=0; path=/';
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };
    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div>
            <h1>Trang chủ</h1>

            {token ? (
                <>
                    <p>Chào mừng bạn đã đăng nhập!</p>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </>
            ) : (
                <>
                    <p>Chào mừng bạn đến với trang chủ!</p>
                    <button onClick={handleLogin}>Đăng nhập</button>
                    <button onClick={handleRegister}>Đăng ký</button>
                </>
            )}
        </div>
    );
};

export default Index;
