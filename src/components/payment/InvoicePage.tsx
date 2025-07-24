
// ✅ InvoicePage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const InvoicePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const orderCode = searchParams.get('orderId');
    const result = searchParams.get('result');

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!orderCode) return;
            try {
                const res = await axios.get(`http://localhost:8080/api/orders/code/${orderCode}`);
                setInvoice(res.data);
            } catch (err) {
                console.error('Lỗi khi lấy hóa đơn:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [orderCode]);

    if (loading) return <div>Đang tải...</div>;
    if (!invoice) return <div>Không tìm thấy hóa đơn.</div>;

    return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">
                {result === 'success' ? 'Thanh toán thành công 🎉' : 'Thanh toán thất bại ❌'}
            </h2>
            <div className="bg-white shadow p-6 rounded border">
                <p><strong>Mã đơn hàng:</strong> {invoice.orderCode}</p>
                <p><strong>Ngày tạo:</strong> {new Date(invoice.orderDate).toLocaleString()}</p>
                <p><strong>Phương thức:</strong> {invoice.paymentMethod}</p>
                <p><strong>Trạng thái:</strong> {invoice.status}</p>
                <p><strong>Tổng tiền:</strong> {invoice.totalAmount} VND</p>
            </div>
        </div>
    );
};

export default InvoicePage;

