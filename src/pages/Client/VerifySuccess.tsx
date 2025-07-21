import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifySuccess: React.FC = () => {
    const [counter, setCounter] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);
        if (counter === 0) {
            navigate('/login');
        }
        return () => clearInterval(timer);
    }, [counter, navigate]);

    return (
        <div>
            <h2>Xác thực tài khoản</h2>
            <p>Xác thực tài khoản thành công. Vui lòng chờ {counter} giây để chuyển về trang đăng nhập...</p>
        </div>
    );
};

export default VerifySuccess;