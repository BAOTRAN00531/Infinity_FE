import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../authService';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(formData);
            localStorage.setItem('access_token', response.access_token);
            navigate('/');
        } catch (err: any) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username hoặc Email</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            <p>Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
        </div>
    );
};

export default Login;