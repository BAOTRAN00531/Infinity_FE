// ... import giữ nguyên
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api';
import { Copy } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PaymentInfo {
    qrCodeUrl?: string;
    bankLogo?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    amount?: number;
    transferContent?: string;
    status?: string;
}

const SepayPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const orderCode = query.get('orderCode');

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({});
    const [countdown, setCountdown] = useState<number>(120);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    const handleCopy = (text: string) => {
        copy(text);
        toast.success('Đã sao chép!');
    };

    useEffect(() => {
        if (!orderCode) return;

        const fetchPaymentInfo = async () => {
            try {
                const res = await api.get(`/api/sepay/pay?orderCode=${orderCode}`);
                setPaymentInfo(res.data);
            } catch (err) {
                console.error('Lỗi lấy thông tin thanh toán:', err);
            }
        };

        fetchPaymentInfo();

        const checkPaymentStatus = async () => {
            try {
                const res = await api.get(`/api/sepay/status?orderCode=${orderCode}`);
                const status = res.data?.status;

                if (status === 'PAID') {
                    toast.success('Thanh toán thành công! Đang chuyển hướng...');
                    setIsChecking(false);
                    setTimeout(() => {
                        navigate(`/invoice?orderId=${orderCode}&result=success`);
                    }, 7000);
                } else if (status === 'FAILED') {
                    toast.error('Thanh toán thất bại.');
                    setIsChecking(false);
                }
            } catch (err) {
                console.error('Lỗi kiểm tra trạng thái thanh toán:', err);
            }
        };

        const pollInterval = setInterval(checkPaymentStatus, 3000);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(pollInterval);
                    clearInterval(countdownInterval);
                    setIsChecking(false);
                    toast.warning('⏳ Hết thời gian thanh toán!');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(pollInterval);
            clearInterval(countdownInterval);
        };
    }, [orderCode, navigate]);

    // 👉 Xử lý hủy thanh toán (gọi API BE)
    const handleCancelPayment = async () => {
        if (!orderCode) return;

        try {
            await api.post(`/api/orders/cancel?orderCode=${orderCode}`);
            toast.info("🚫 Bạn đã hủy thanh toán.");
            setIsChecking(false);
            setTimeout(() => {
                navigate("/"); // hoặc "/cart"
            }, 1500);
        } catch (err) {
            console.error("Cancel error:", err);
            toast.error("Không thể hủy thanh toán. Thử lại sau!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-md border p-8">
            <ToastContainer />

            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
                Xác thực thanh toán đơn hàng <span className="text-black">{orderCode}</span>
            </h2>

            {isChecking && (
                <div className="text-center text-sm text-red-600 mb-4">
                    ⏳ Thời gian còn lại để thanh toán: {countdown}s
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT - QR */}
                <div className="flex flex-col justify-center items-center gap-4">
                    {paymentInfo.qrCodeUrl ? (
                        <img
                            src={paymentInfo.qrCodeUrl}
                            alt="QR Code VietQR"
                            className="w-72 h-72 border rounded-md"
                        />
                    ) : (
                        <div className="text-red-500">Không có mã QR</div>
                    )}

                    {/* 👉 Nút hủy thanh toán */}
                    <button
                        onClick={handleCancelPayment}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                    >
                        ❌ Hủy thanh toán
                    </button>
                </div>

                {/* RIGHT - Info */}
                <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        {paymentInfo.bankLogo && (
                            <img src={paymentInfo.bankLogo} alt="Bank" className="w-10 h-10" />
                        )}
                        <div>
                            <div className="text-base font-semibold">
                                {paymentInfo.bankName || 'Không rõ ngân hàng'}
                            </div>
                            <div className="text-gray-500">Ngân hàng</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-500 mb-1">Chủ tài khoản</div>
                        <div className="font-medium">{paymentInfo.accountName || '...'}</div>
                    </div>

                    <div>
                        <div className="text-gray-500 mb-1 flex items-center justify-between">
                            Số tài khoản
                            <Copy
                                onClick={() => handleCopy(paymentInfo.accountNumber || '')}
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                            />
                        </div>
                        <div className="font-medium">{paymentInfo.accountNumber || '...'}</div>
                    </div>

                    <div>
                        <div className="text-gray-500 mb-1">Số tiền</div>
                        <div className="text-lg font-bold text-green-600">
                            {paymentInfo.amount
                                ? Number(paymentInfo.amount).toLocaleString('vi-VN')
                                : '0'}{' '}
                            VND
                        </div>
                    </div>

                    <div>
                        <div className="text-gray-500 mb-1 flex items-center justify-between">
                            Nội dung chuyển khoản
                            <Copy
                                onClick={() => handleCopy(paymentInfo.transferContent || '')}
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                            />
                        </div>
                        <div className="font-medium">{paymentInfo.transferContent || '...'}</div>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between font-semibold text-base">
                        <span>Tổng cộng</span>
                        <span>
                            {paymentInfo.amount
                                ? Number(paymentInfo.amount).toLocaleString('vi-VN')
                                : '0'}{' '}
                            VND
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SepayPaymentPage;
