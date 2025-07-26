import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from "@/components/layout-components/Header";

const InvoicePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const orderCode = searchParams.get('orderId');
    const result = searchParams.get('result');

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!orderCode) return;

            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            if (!token) {
                console.warn('Không có token!');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8080/api/orders/code/${orderCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInvoice(res.data);
            } catch (err) {
                console.error('Lỗi khi lấy hóa đơn:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [orderCode]);


    if (loading) return <div className="p-10 text-gray-600">Đang tải...</div>;
    if (!invoice) return <div className="p-10 text-red-500">Không tìm thấy hóa đơn.</div>;

    return (
        <>
            <Header />
        <div className="p-10 max-w-2xl mx-auto">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-green-600">
                    {result === 'success' ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại'}
                </h2>
                <p className="text-gray-500">Thông tin chi tiết đơn hàng của bạn</p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                <div className="space-y-4 text-gray-700">
                    <div><strong>Mã đơn hàng:</strong> {invoice.orderCode}</div>
                    <div><strong>Ngày tạo:</strong> {new Date(invoice.orderDate).toLocaleString()}</div>
                    <div><strong>Phương thức:</strong> {invoice.paymentMethod ?? 'Chưa chọn'}</div>
                    <div><strong>Trạng thái:</strong> {invoice.status}</div>
                    <div><strong>Tổng tiền:</strong> {invoice.totalAmount.toLocaleString()} VND</div>
                </div>

                {invoice.details?.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg mb-2">Chi tiết:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                            {invoice.details.map((item: any, idx: number) => (
                                <li key={idx}>
                                    <span className="font-medium">{item.serviceName}</span>: {item.serviceDesc} – {item.price.toLocaleString()} VND
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default InvoicePage;
