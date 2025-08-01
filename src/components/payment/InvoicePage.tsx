// pages/InvoicePage.tsx
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageLayout from '@/components/layout-components/PageLayout';
import {useNavigate, useSearchParams} from "react-router-dom";

interface OrderDetailDTO {
    serviceName: string;
    serviceDesc: string;
    price: number;
}
interface Invoice {
    courseName: string;
    orderCode: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    orderDate: string;
    details: OrderDetailDTO[];
}

const statusBadge: Record<string, string> = {
    PENDING:   'bg-yellow-100 text-yellow-800',
    PROCESSING:'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED:  'bg-red-100 text-red-800',
};

const InvoicePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [invoice, setInvoice]   = useState<Invoice | null>(null);
    const [loading, setLoading]   = useState(true);
    const navigate                = useNavigate();

    const orderCode = searchParams.get('orderId');
    const result    = searchParams.get('result');   // success | fail

    /* 📥 Lấy hoá đơn */
    useEffect(() => {
        const fetchData = async () => {
            if (!orderCode) return;

            const token =
                localStorage.getItem('access_token') ??
                sessionStorage.getItem('access_token');

            try {
                const { data } = await axios.get<Invoice>(
                    `/api/orders/code/${orderCode}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setInvoice(data);
            } catch (err) {
                toast.error('Không thể tải hoá đơn', {
                    autoClose: 1200, // 👈 1.2 giây riêng lẻ
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderCode]);

    /* 🗑 Huỷ đơn */
    const handleCancel = async () => {
        if (!invoice) return;
        if (!window.confirm('Bạn chắc chắn muốn huỷ đơn hàng này?')) return;

        const token =
            localStorage.getItem('access_token') ??
            sessionStorage.getItem('access_token');

        try {
            await axios.post(
                `/api/orders/cancel?orderCode=${invoice.orderCode}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Huỷ đơn thành công!', {
                autoClose: 1200, // 👈 1.2 giây riêng lẻ
            });
            // Chờ toast rồi về lịch sử
            setTimeout(() => navigate('/order-history'), 1500);
        } catch (err) {
            toast.error('Không thể huỷ đơn. Vui lòng thử lại.', {
                autoClose: 1200, // 👈 1.2 giây riêng lẻ
            });
        }
    };

    /* UI */
    if (loading)
        return <div className="p-10 text-gray-600">Đang tải...</div>;
    if (!invoice)
        return <div className="p-10 text-red-500">Không tìm thấy hoá đơn.</div>;

    return (
        <PageLayout>
            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Tiêu đề */}
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`text-2xl font-bold mb-6 ${
                        result === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {result === 'success' && '🎉 Thanh toán thành công!'}
                    {result === 'fail' && '❌ Đơn hàng đã huỷ'}
                    {result === 'pending' && '⏳ Đơn hàng đang chờ xử lý'}
                </motion.h2>

                {/* Card hoá đơn */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="font-semibold">Mã đơn:</span>
                        <span className="font-mono">{invoice.orderCode}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="font-semibold">Khóa học:</span>
                        <span className="font-mono">{invoice.courseName}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="font-semibold">Ngày tạo:</span>
                        <span>
              {new Date(invoice.orderDate).toLocaleString('vi-VN')}
            </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="font-semibold">Phương thức:</span>
                        <span>{invoice.paymentMethod}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-semibold">Trạng thái:</span>
                        <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                statusBadge[invoice.status] ?? 'bg-gray-100 text-gray-800'
                            }`}
                        >
              {invoice.status}
            </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="font-semibold">Tổng tiền:</span>
                        <span className="text-green-600 font-bold">
              {invoice.totalAmount.toLocaleString()}₫
            </span>
                    </div>

                    {/* Chi tiết dịch vụ */}
                    {invoice.details?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Chi tiết:</h4>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                {invoice.details.map((d, idx) => (
                                    <li key={idx}>
                                        <span className="font-medium">{d.serviceName}</span>:{" "}
                                        {d.serviceDesc} –{" "}
                                        {d.price.toLocaleString()}₫
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Nút huỷ đơn */}
                    {invoice.status === 'PENDING' && (
                        <button
                            onClick={handleCancel}
                            className="mt-4 w-full sm:w-auto px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Huỷ đơn hàng
                        </button>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default InvoicePage;
