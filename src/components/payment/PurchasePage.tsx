import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import momoIcon from "@/components/payment/icons/momo-logo.png";
import vnpayIcon from "@/components/payment/icons/vnpay-logo.png";
import codIcon from "@/components/payment/icons/cod.png";
import Header from "@/components/layout-components/Header";
import PageLayout from "@/components/layout-components/PageLayout";

const PurchasePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");

    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("MOMO");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Vui lòng đăng nhập trước khi mua.");
            navigate("/login");
            return;
        }

        const decoded: any = jwtDecode(token);
        const email = decoded?.sub;

        const fetchUserAndCourse = async () => {
            try {
                const [userRes, courseRes] = await Promise.all([
                    axios.get(`/api/users/email/${email}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`/client/api/course/${courseId}`),
                ]);
                setUser(userRes.data);
                setCourse(courseRes.data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
                alert("Không thể tải thông tin người dùng hoặc khóa học.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchUserAndCourse();
    }, [courseId]);

    const handleBuy = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token || !user || !courseId) return;

            setSubmitting(true);

            const res = await axios.post(
                "/api/orders/create",
                {
                    userId: user.id,
                    courseId: Number(courseId),
                    paymentMethod,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const orderCode = res.data.orderCode;

            if (paymentMethod === "MOMO") {
                window.location.href = `http://localhost:8080/api/momo/pay?orderCode=${orderCode}`;
            } else if (paymentMethod === "VNPAY") {
                window.location.href = `http://localhost:8080/api/vnpay/pay?orderCode=${orderCode}`;
            } else {
                // COD
                navigate(`/invoice?orderId=${orderCode}&result=success`);
            }
        } catch (err) {
            console.error("Lỗi khi tạo đơn hàng:", err);
            alert("Không thể tạo đơn hàng.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Đang tải thông tin...</div>;

    return (

        <>
            <PageLayout>
        <div className="max-w-xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Mua khóa học</h1>

            <p className="mb-2 text-gray-700 dark:text-gray-300">
                Xin chào <strong>{user?.username}</strong>,
            </p>

            <p className="mb-2 text-gray-700 dark:text-gray-300">
                Bạn sắp mua khóa học: <strong>{course?.name}</strong>
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
                Giá: <strong>{course?.price?.toLocaleString()} VNĐ</strong>
            </p>

            {/* Chọn phương thức thanh toán */}
            <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Chọn phương thức thanh toán:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* MOMO */}
                    <button
                        onClick={() => setPaymentMethod("MOMO")}
                        className={`flex items-center justify-center p-3 border rounded-lg transition ${
                            paymentMethod === "MOMO"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 bg-white"
                        }`}
                    >
                        <img src={momoIcon} alt="MoMo" className="h-6 mr-2" />
                        <span className="text-sm font-medium text-gray-700">MoMo</span>
                    </button>

                    {/* VNPAY */}
                    <button
                        onClick={() => setPaymentMethod("VNPAY")}
                        className={`flex items-center justify-center p-3 border rounded-lg transition ${
                            paymentMethod === "VNPAY"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 bg-white"
                        }`}
                    >
                        <img src={vnpayIcon} alt="VNPay" className="h-6 mr-2" />
                        <span className="text-sm font-medium text-gray-700">VNPay</span>
                    </button>

                    {/* COD */}
                    <button
                        onClick={() => setPaymentMethod("CASH")}
                        className={`flex items-center justify-center p-3 border rounded-lg transition ${
                            paymentMethod === "CASH"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 bg-white"
                        }`}
                    >
                        <img src={codIcon} alt="CASH" className="h-6 mr-2" />
                        <span className="text-sm font-medium text-gray-700">CASH</span>
                    </button>
                </div>
            </div>

            <button
                onClick={handleBuy}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                disabled={submitting}
            >
                {submitting ? "Đang xử lý..." : "Xác nhận mua ngay"}
            </button>

            {/* Loading Overlay */}
            {submitting && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-center">
                        <p className="text-lg font-semibold text-blue-600">Đang tạo đơn hàng...</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            )}
        </div>
            </PageLayout>
        </>

    );
};

export default PurchasePage;
