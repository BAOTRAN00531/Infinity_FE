import React from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const VerifyConfirmation: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300 rounded-full">
                        <Mail className="w-12 h-12" />
                    </div>
                </div>

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Xác nhận Email
                </h2>

                {/* Nội dung */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Chúng tôi đã gửi một email xác nhận đến địa chỉ bạn đã đăng ký. <br />
                    Vui lòng kiểm tra hộp thư và bấm vào liên kết để hoàn tất đăng ký. <br />
                    Đừng quên kiểm tra cả thư mục <span className="font-medium text-gray-800 dark:text-gray-200">Spam / Quảng cáo</span> nếu không thấy.
                </p>

                {/* Nút quay lại */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại đăng nhập
                </Link>
            </motion.div>
        </div>
    );
};

export default VerifyConfirmation;
