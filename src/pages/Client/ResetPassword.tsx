import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "../../components/lib/icon";
import FancyButton from "../../components/button/FancyButton";
import api from "@/api";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); // 0-5 scale
    const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const { strength, feedback } = checkPasswordStrength(newPassword);
        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
    }, [newPassword]);

    const checkPasswordStrength = (password: string) => {
        const feedback = [];
        let strength = 0;

        // Kiểm tra độ dài
        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push("Tối thiểu 8 ký tự");
        }

        // Kiểm tra chữ thường
        if (/[a-z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("Thiếu chữ thường");
        }

        // Kiểm tra chữ hoa
        if (/[A-Z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("Thiếu chữ hoa");
        }

        // Kiểm tra số
        if (/[0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("Thiếu số");
        }

        // Kiểm tra ký tự đặc biệt
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("Thiếu ký tự đặc biệt");
        }

        return { strength, feedback };
    };

    const getPasswordStrengthLabel = (strength: number) => {
        if (strength <= 2) return "Yếu";
        if (strength === 3) return "Trung bình";
        if (strength === 4) return "Mạnh";
        return "Rất mạnh";
    };

    const getPasswordStrengthColor = (strength: number) => {
        if (strength <= 2) return "bg-red-500";
        if (strength === 3) return "bg-yellow-500";
        if (strength === 4) return "bg-green-500";
        return "bg-green-600";
    };

    const validate = () => {
        if (!newPassword.trim()) {
            toast.error("Vui lòng nhập mật khẩu mới", { autoClose: 1200 });
            return false;
        }

        if (!confirmPassword.trim()) {
            toast.error("Vui lòng xác nhận mật khẩu mới", { autoClose: 1200 });
            return false;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu không khớp", { autoClose: 1200 });
            return false;
        }

        if (passwordStrength < 3) {
            toast.error("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn", { autoClose: 1200 });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const { data } = await api.post("/auth/reset-password", {
                otp: localStorage.getItem("otp") || "",
                newPassword,
            });

            toast.success(data.message || "Đặt lại mật khẩu thành công", { autoClose: 2000 });

            // Xóa OTP khỏi localStorage sau khi sử dụng
            localStorage.removeItem("otp");

            // Chuyển hướng đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            toast.error(message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6 bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl p-6 shadow-md"
            >
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Đặt lại mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mật khẩu mới */}
                    <div className="relative">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full h-12 pl-4 pr-10 rounded-xl border-none text-black dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 text-base"
                                placeholder="Nhập mật khẩu mới..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                        Độ mạnh mật khẩu: {getPasswordStrengthLabel(passwordStrength)}
                                    </span>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {passwordStrength}/5
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div
                                        className={`h-1.5 rounded-full ${getPasswordStrengthColor(passwordStrength)}`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Password Feedback */}
                                {passwordFeedback.length > 0 && (
                                    <div className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        {passwordFeedback.map((msg, index) => (
                                            <div key={index}>• {msg}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div className="relative">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nhập lại mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full h-12 pl-4 pr-10 rounded-xl border-none text-black dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400 text-base"
                                placeholder="Nhập lại mật khẩu..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Mật khẩu khớp indicator */}
                        {confirmPassword && (
                            <div className="mt-1 text-xs">
                                {newPassword === confirmPassword ? (
                                    <span className="text-green-500">✓ Mật khẩu khớp</span>
                                ) : (
                                    <span className="text-red-500">✗ Mật khẩu không khớp</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nút Submit */}
                    <FancyButton
                        type="submit"
                        text={loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" fill="currentColor" />
                                </svg>
                                Đang lưu...
                            </span>
                        ) : "Lưu mật khẩu"}
                        size="large"
                        fullWidth
                        disabled={loading}
                        className={loading ? "opacity-70 cursor-not-allowed" : ""}
                    />
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;