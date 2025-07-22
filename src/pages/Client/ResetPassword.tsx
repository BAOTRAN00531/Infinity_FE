import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


import { FaEye, FaEyeSlash , FaSpinner } from "../../components/lib/icon";
import FancyButton from "../../components/button/FancyButton";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [popupType, setPopupType] = useState<'success' | 'error'>('success');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const strength = getPasswordStrength(newPassword);
        setPasswordStrength(strength);
    }, [newPassword]);

    const getPasswordStrength = (password: string): string => {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        const isLong = password.length >= 8;

        const score = [hasUpper, hasLower, hasNumber, hasSpecial, isLong].filter(Boolean).length;

        if (score <= 2) return 'Yếu';
        if (score === 3 || score === 4) return 'Trung bình';
        return 'Mạnh';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu không khớp');
            setPopupType('error');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        setLoading(true);
        const response = await fetch('http://localhost:8080/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                otp: localStorage.getItem('otp') || '',
                newPassword,
            }),
        });
        const data = await response.json();
        setMessage(data.message);
        setPopupType(response.ok ? 'success' : 'error');
        setShowPopup(true);
        setLoading(false);

        if (response.ok) {
            setTimeout(() => {
                setShowPopup(false);
                navigate('/login');
            }, 2000);
        } else {
            setTimeout(() => setShowPopup(false), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] dark:bg-gray-900 px-4 relative">
            {/* POPUP THÔNG BÁO */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className={`fixed top-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white ${
                            popupType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <p className={`mt-1 text-sm ${passwordStrength === 'Mạnh'
                            ? 'text-green-600'
                            : passwordStrength === 'Trung bình'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}>
                            Độ mạnh: {passwordStrength}
                        </p>
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
                    </div>

                    {/* Nút Submit */}
                    <FancyButton
                        type="submit"
                        text={loading ? "Đang lưu..." : "Lưu mật khẩu"}
                        onClick={() => {}}
                        size="large"
                        fullWidth
                        className={loading ? "opacity-70 cursor-not-allowed" : ""}
                    />
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;