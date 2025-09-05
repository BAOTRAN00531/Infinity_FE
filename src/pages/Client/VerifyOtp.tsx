import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaSpinner } from "../../components/lib/icon";
import FancyButton from "../../components/button/FancyButton";
import api from "@/api";

// Tách component OTPInput ra riêng để tối ưu hiệu suất
const OTPInput = memo(({
                           value,
                           onChange,
                           onKeyDown,
                           onPaste,
                           index,
                           focus
                       }: {
    value: string;
    onChange: (value: string, index: number) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
    onPaste: (e: React.ClipboardEvent) => void;
    index: number;
    focus: boolean;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus vào input khi cần
    useEffect(() => {
        if (focus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focus]);

    return (
        <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => onChange(e.target.value, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
            onPaste={index === 0 ? onPaste : undefined}
            className="w-12 h-14 text-center text-2xl rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
        />
    );
});

const VerifyOtp: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState<number>(0);
    const [activeIndex, setActiveIndex] = useState(0); // Theo dõi ô đang được focus
    const email = localStorage.getItem('forgotEmail') || '';
    const navigate = useNavigate();

    // Xử lý đếm ngược gửi lại OTP
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    // Xử lý thay đổi giá trị OTP
    const handleChange = useCallback((value: string, index: number) => {
        // Chỉ cho phép số
        if (!/^\d?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        // Tự động chuyển sang ô tiếp theo nếu có giá trị
        if (value && index < 5) {
            setActiveIndex(index + 1);
        }
    }, [otp]);

    // Xử lý sự kiện bàn phím
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const updated = [...otp];
                updated[index] = '';
                setOtp(updated);
            } else if (index > 0) {
                setActiveIndex(index - 1);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            setActiveIndex(index - 1);
        } else if (e.key === 'ArrowRight' && index < 5) {
            setActiveIndex(index + 1);
        }
    }, [otp]);

    // Xử lý dán OTP
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').trim().replace(/\D/g, '');
        if (!data) return;

        const newOtp = data.split('').slice(0, 6);
        const filled = [...otp];
        newOtp.forEach((val, idx) => {
            filled[idx] = val;
        });
        setOtp(filled);

        // Focus vào ô cuối cùng hoặc ô tiếp theo
        const nextIndex = Math.min(newOtp.length, 5);
        setActiveIndex(nextIndex);
    }, [otp]);

    // Xử lý xác minh OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra OTP đã được điền đầy đủ chưa
        if (otp.some(digit => !digit)) {
            toast.error("Vui lòng nhập đầy đủ mã OTP", { autoClose: 1200 });
            return;
        }

        setLoading(true);
        try {
            const otpCode = otp.join('');
            const res = await api.post('/auth/verify-otp', { otp: otpCode, email });

            toast.success(res.data.message || "Xác minh OTP thành công", { autoClose: 2000 });

            setOtp(Array(6).fill(''));

            if (res.status === 200) {
                localStorage.setItem('otp', otpCode);
                setTimeout(() => navigate('/reset-password'), 1000);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Xác minh thất bại';
            toast.error(message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gửi lại OTP
    const handleResend = async () => {
        if (resendCountdown > 0) return;

        try {
            const res = await api.post('/auth/resend-otp', { email });
            toast.success(res.data.message || "Đã gửi lại mã OTP", { autoClose: 2000 });
            setResendCountdown(60);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Không thể gửi lại OTP';
            toast.error(message, { autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6 bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl p-6 shadow-md"
            >
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Xác thực OTP</h2>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    Mã OTP đã được gửi đến email: <span className="font-medium">{email}</span>
                </p>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((value, index) => (
                            <OTPInput
                                key={index}
                                value={value}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                index={index}
                                focus={activeIndex === index}
                            />
                        ))}
                    </div>

                    <FancyButton
                        type="submit"
                        text={loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" fill="currentColor" />
                                </svg>
                                Đang xác thực...
                            </span>
                        ) : "Xác thực"}
                        size="large"
                        fullWidth
                        disabled={loading}
                        className={loading ? "opacity-70 cursor-not-allowed" : ""}
                    />

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCountdown > 0}
                        className={`w-full text-center text-sm font-medium ${
                            resendCountdown > 0
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'text-blue-600 dark:text-blue-400 hover:underline'
                        }`}
                    >
                        {resendCountdown > 0
                            ? `Gửi lại OTP sau ${resendCountdown}s`
                            : 'Gửi lại mã OTP'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Quay lại trang quên mật khẩu
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;