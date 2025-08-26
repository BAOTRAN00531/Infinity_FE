// pages/Client/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaMoon, FaStar } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden text-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
            {/* 🌙 Mặt trăng */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-10 right-20 text-yellow-300 text-6xl"
            >
                <FaMoon />
            </motion.div>

            {/* ✨ Sao lấp lánh */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-yellow-200"
                    style={{
                        top: `${Math.random() * 90}%`,
                        left: `${Math.random() * 90}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                    }}
                >
                    <FaStar className="text-xs" />
                </motion.div>
            ))}

            {/* 404 số to */}
            <motion.h1
                className="text-9xl font-extrabold tracking-widest drop-shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                404
            </motion.h1>

            {/* Lời nhắn */}
            <motion.h2
                className="mt-6 text-2xl font-light text-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Oops… Trang bạn tìm kiếm đã lạc trong vũ trụ ✨
            </motion.h2>

            <motion.p
                className="mt-4 max-w-lg text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                Có thể địa chỉ bạn nhập không tồn tại, hoặc nó đã bay đi mất
                cùng những vì sao. Đừng lo, hãy quay về ngôi nhà chính nhé.
            </motion.p>

            {/* Nút quay lại */}
            <motion.div
                className="mt-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition shadow-lg font-semibold"
                >
                    <FaHome /> Về trang chủ
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
