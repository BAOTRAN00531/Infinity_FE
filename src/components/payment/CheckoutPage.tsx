// CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/api'; // ✅ dùng axios instance có baseURL & token

const CheckoutPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [method, setMethod] = useState<'VNPAY' | 'CASH'>('VNPAY');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await api.post('/api/orders/create', {
                courseId,
                paymentMethod: method,
                fullName,
                phone,
            });

            if (method === 'VNPAY') {
                window.location.href = res.data.paymentUrl; // ✅ redirect đến VNPAY
            } else {
                navigate(`/invoice?orderId=${res.data.orderCode}&result=success`);
            }
        } catch (err) {
            console.error('Lỗi tạo đơn hàng:', err);
            alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h2>

            <input
                type="text"
                placeholder="Họ tên"
                className="w-full mb-4 border px-3 py-2 rounded"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full mb-4 border px-3 py-2 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'VNPAY' | 'CASH')}
                className="w-full mb-6 border px-3 py-2 rounded"
            >
                <option value="VNPAY">Thanh toán qua VNPAY</option>
                <option value="CASH">Thanh toán khi nhận hàng</option>
            </select>

            <button
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleSubmit}
            >
                Tiếp tục thanh toán
            </button>
        </div>
    );
};

export default CheckoutPage;
