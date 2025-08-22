// pages/Client/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            color: '#343a40',
        }}>
            <h1 style={{ fontSize: '10rem', margin: 0 }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
                Không tìm thấy trang
            </h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.5' }}>
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Có thể bạn đã nhập sai địa chỉ hoặc trang đã bị di chuyển.
            </p>
            <Link to="/" style={{
                marginTop: '2rem',
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
            }}>
                Về trang chủ
            </Link>
        </div>
    );
};

export default NotFoundPage;