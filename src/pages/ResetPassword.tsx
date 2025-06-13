import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp: localStorage.getItem('otp') || '', newPassword }),
        });
        const data = await response.json();
        setMessage(data.message);
        if (response.ok) navigate('/login');
    };

    return (
        <div>
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mật khẩu mới</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit">Lưu mật khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;