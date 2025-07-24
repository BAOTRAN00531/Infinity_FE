import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PurchasePage: React.FC = () => {
    const navigate = useNavigate();

    const handleBuy = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Vui lòng đăng nhập trước khi mua.');
                navigate('/login');
                return;
            }

            const userId = 1; // Lấy từ token nếu có
            const courseId = 1; // Hardcoded, bạn có thể dùng useParams nếu cần động
            const paymentMethod = 'VNPAY';

            const res = await axios.post(
                'http://localhost:8080/api/orders/create',
                { userId, courseId, paymentMethod },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const orderCode = res.data.orderCode;

            // Chuyển hướng sang trang thanh toán VNPAY
            window.location.href = `http://localhost:8080/api/vnpay/pay?orderCode=${orderCode}`;
        } catch (err) {
            console.error('Lỗi khi tạo đơn hàng:', err);
            alert('Không thể tạo đơn hàng.');
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Mua quyền truy cập khóa học</h1>
            <p className="mb-4">Bạn sẽ được mở khóa toàn bộ nội dung trong 12 tháng.</p>
            <button
                onClick={handleBuy}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Mua ngay
            </button>
        </div>
    );
};

export default PurchasePage;
