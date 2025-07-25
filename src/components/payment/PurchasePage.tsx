// PurchasePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import axios from "axios";

const PurchasePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Vui lòng đăng nhập trước khi mua.");
            navigate("/login");
            return;
        }

        const decoded: any = jwtDecode(token);
        const email = decoded?.sub;

        axios
            .get(`/api/users/email/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setUser(res.data))
            .catch(() => alert("Không thể lấy thông tin người dùng."));
    }, []);

    const handleBuy = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token || !user || !courseId) return;

            const res = await axios.post(
                "/api/orders/create",
                {
                    userId: user.id,
                    courseId: Number(courseId),
                    paymentMethod: "COD", // 👉 sau sẽ đổi thành VNPAY
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const orderCode = res.data.orderCode;
            navigate(`/invoice?orderId=${orderCode}&result=success`);

            // 👉 sau này dùng:
            // window.location.href = `http://localhost:8080/api/vnpay/pay?orderCode=${orderCode}`;
        } catch (err) {
            console.error("Lỗi khi tạo đơn hàng:", err);
            alert("Không thể tạo đơn hàng.");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Mua khóa học</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
                Xin chào <strong>{user?.username}</strong>, bạn sắp mua khóa học có ID: <strong>{courseId}</strong>
            </p>
            <button
                onClick={handleBuy}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Xác nhận mua ngay
            </button>
        </div>
    );
};

export default PurchasePage;
