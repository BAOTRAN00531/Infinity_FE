import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaSpinner } from "@/components/lib/icon";


import Header from "../components/layout-components/Header";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) navigate("/verify-otp");
        } catch (error) {
            setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 flex flex-col min-h-screen relative">
            <Header />

            {/* Nội dung */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <h1 className="text-4xl font-bold mb-10 text-black dark:text-white tracking-widest text-center">
                    QUÊN MẬT KHẨU
                </h1>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg space-y-6 bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl p-6 shadow-md"
                >
                    {/* Email Field */}
                    <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nhập Email của bạn
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-14 pl-11 pr-4 rounded-xl border-none text-black dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 transition-all"
                                placeholder="ví dụ: abc@gmail.com"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full h-[60px] relative rounded-xl transition-opacity ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        style={{
                            backgroundImage: "url('/3d-button-1.png')",
                            backgroundSize: "100% 100%",
                        }}
                    >
    <span className="absolute inset-0 flex items-center justify-center transform -translate-y-[14%] text-black font-bold text-lg tracking-wide">
      {loading ? (
          <FaSpinner className="animate-spin text-xl" />
      ) : (
          "Gửi mã OTP"
      )}
    </span>
                    </motion.button>
                </motion.form>

                {message && (
                    <p className="mt-6 text-center text-sm text-green-500 dark:text-green-400">{message}</p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

