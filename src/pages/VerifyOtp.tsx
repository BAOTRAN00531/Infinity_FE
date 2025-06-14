import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState(localStorage.getItem('forgotEmail') || '');
    const navigate = useNavigate();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp, email }),
        });
        const data = await response.json();
        setMessage(data.message);
        if (response.ok) {
            localStorage.setItem('otp', otp);
            navigate('/reset-password');
        }
    };

    const handleResend = async () => {
        const response = await fetch('http://localhost:8080/auth/resend-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div>
            <h2>Xác thực OTP</h2>
            <form onSubmit={handleVerify}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('forgotEmail', e.target.value); }} required />
                </div>
                <div>
                    <label>OTP</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                <button type="submit">Xác thực</button>
                <button type="button" onClick={handleResend} style={{ marginLeft: '10px' }}>Gửi lại OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOtp;