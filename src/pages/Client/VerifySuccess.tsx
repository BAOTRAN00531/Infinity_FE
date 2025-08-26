import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const VerifySuccess: React.FC = () => {
    const [counter, setCounter] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/login");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
                {/* Icon thành công */}
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                </div>

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Xác thực tài khoản thành công 🎉
                </h2>

                {/* Nội dung */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Tài khoản của bạn đã được xác thực thành công.
                </p>

                {/* Đếm ngược */}
                <p className="text-sm text-gray-500">
                    Bạn sẽ được chuyển đến trang đăng nhập sau{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
            {counter}
          </span>{" "}
                    giây...
                </p>

                {/* Nút quay lại ngay */}
                <button
                    onClick={() => navigate("/login")}
                    className="mt-6 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow-md"
                >
                    Đăng nhập ngay
                </button>
            </motion.div>
        </div>
    );
};

export default VerifySuccess;
