import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/layout-components/Header";
import { Card, CardContent } from "@/components/reusable-components/card";
import { Input } from "@/components/reusable-components/input";
import FancyButton from "@/components/button/FancyButton";
import { FaEye, FaEyeSlash } from "@/components/lib/icon";
import { register } from "@/authService";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); // 0-5 scale
    const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            const { strength, feedback } = checkPasswordStrength(value);
            setPasswordStrength(strength);
            setPasswordFeedback(feedback);
        }
    };

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
        const email = formData.email.trim();
        const username = formData.username.trim();
        const password = formData.password.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ.", { autoClose: 1200 });
            return false;
        }

        if (username.length < 3) {
            toast.error("Tên đăng nhập tối thiểu 3 ký tự.", { autoClose: 1200 });
            return false;
        }

        if (password.length < 8) {
            toast.error("Mật khẩu tối thiểu 8 ký tự.", { autoClose: 1200 });
            return false;
        }

        if (passwordStrength < 3) {
            toast.error("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.", { autoClose: 1200 });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await register(formData);
            if (result.status === 200) {
                toast.success("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.", { autoClose: 2200 });
                setFormData({ email: "", username: "", password: "" });
                setPasswordStrength(0);
                setPasswordFeedback([]);
                setTimeout(() => navigate("/verify-confirmation"), 3000);
            } else {
                toast.error("Đăng ký thất bại. Mã trạng thái: " + result.status, { autoClose: 1200 });
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            toast.error(message, { autoClose: 1200 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 flex flex-col min-h-screen">
            <Header />
            <motion.div
                className="flex-1 flex flex-col items-center justify-center px-4 py-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white mb-8 tracking-widest">
                    REGISTER
                </h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mx-auto">
                    {/* Email */}
                    <Card className="bg-gray-100 dark:bg-gray-800 rounded-2xl border-none">
                        <CardContent className="p-0 h-12 flex items-center">
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full h-full bg-transparent border-none px-4 text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                                autoComplete="email"
                            />
                        </CardContent>
                    </Card>

                    {/* Username */}
                    <Card className="bg-gray-100 dark:bg-gray-800 rounded-2xl border-none">
                        <CardContent className="p-0 h-12 flex items-center">
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Tên đăng nhập"
                                className="w-full h-full bg-transparent border-none px-4 text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                                autoComplete="username"
                            />
                        </CardContent>
                    </Card>

                    {/* Password */}
                    <Card className="bg-gray-100 dark:bg-gray-800 rounded-2xl border-none relative">
                        <CardContent className="p-0 h-12 flex items-center relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                                className="w-full h-full bg-transparent border-none px-4 text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-gray-600 dark:text-gray-300"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </CardContent>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="px-4 pb-3">
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
                    </Card>

                    {/* Submit */}
                    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                        <FancyButton
                            text={loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" fill="currentColor" />
                                    </svg>
                                    Đang đăng ký...
                                </span>
                            ) : "Đăng ký"}
                            variant="primary"
                            type="submit"
                            className="w-full h-[50px] text-lg tracking-wide font-bold"
                            disabled={loading}
                            fullWidth
                        />
                    </motion.div>
                </form>

                <p className="text-center mt-10 text-black dark:text-white text-sm">
                    Đã có tài khoản?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-blue-500 hover:underline"
                    >
                        Đăng nhập
                    </button>
                </p>
            </motion.div>

            <footer className="text-center mt-10 px-6 text-black dark:text-white text-xs pb-10">
                <p>By registering on Infinity, you agree to our Policies and Privacy Policy.</p>
                <p className="mt-2">
                    This site is protected by reCAPTCHA and subject to the Google Privacy Policy and Terms of Service.
                </p>
            </footer>
        </div>
    );
}