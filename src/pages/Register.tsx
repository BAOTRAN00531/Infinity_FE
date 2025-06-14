import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../authService';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await register(formData); // Nhận object { status, data }
            if (result.status === 200) { // Kiểm tra status
                navigate('/verify-confirmation');
            } else {
                setError('Đăng ký thất bại. Mã trạng thái: ' + result.status);
            }
        } catch (err: any) {
            setError('Đăng ký thất bại. Vui lòng thử lại. ' + (err.response?.data?.message || ''));
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                </div>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                </div>
                <button type="submit">Đăng ký</button>
            </form>
            <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
    );
};

export default Register;