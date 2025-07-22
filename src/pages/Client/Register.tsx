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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const email = formData.email.trim();
        const username = formData.username.trim();
        const password = formData.password.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ.");
            return false;
        }
        if (username.length < 3) {
            toast.error("Tên đăng nhập tối thiểu 3 ký tự.");
            return false;
        }
        if (password.length < 8) {
            toast.error("Mật khẩu tối thiểu 8 ký tự.");
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
                toast.success("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.");
                setFormData({ email: "", username: "", password: "" });
                setTimeout(() => navigate("/verify-confirmation"), 3000);
            } else {
                toast.error("Đăng ký thất bại. Mã trạng thái: " + result.status);
            }
        } catch (err: any) {
            toast.error("Đăng ký thất bại. " + (err.response?.data?.message || "Vui lòng thử lại."));
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
                    <a href="/login" className="text-blue-500 hover:underline">
                        Đăng nhập
                    </a>
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
