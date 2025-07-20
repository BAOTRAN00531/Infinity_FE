import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/reusable-components/button";
import { Card, CardContent } from "@/components/reusable-components/card";
import { Input } from "@/components/reusable-components/input";
import Header from "../components/layout-components/Header";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "@/components/lib/icon";
import { login } from "@/authService";
import { jwtDecode } from "jwt-decode";
import FancyButton from "@/components/button/FancyButton"; // Thêm để decode token

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [popupType, setPopupType] = useState<'success' | 'error'>('error');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(formData);

            // ✅ Lưu user info và token vào localStorage
            localStorage.setItem("user", JSON.stringify(res.userp));
            localStorage.setItem("access_token", res.access_token); // Đổi key thành "access_token" để đồng bộ với App.tsx

            // Decode token để lấy role
            const decodedToken: any = jwtDecode(res.access_token);
            const role = decodedToken.role;

            setError("Đăng nhập thành công.");
            setPopupType("success");

            // Chuyển hướng dựa trên vai trò
            setTimeout(() => {
                if (role === 'ROLE_ADMIN') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (err) {
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
            setPopupType("error");
        }

        setTimeout(() => {
            setError("");
        }, 3000);
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
                {/* POPUP THÔNG BÁO */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className={`fixed top-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white ${
                                popupType === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <h1 className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white mb-8 tracking-widest">
                    LOGIN
                </h1>

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <Card className="bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl border-none">
                        <CardContent className="p-0 h-12 sm:h-[48px] flex items-center">
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Email hoặc tên đăng nhập"
                                className="w-full h-full bg-transparent border-none px-4 text-sm sm:text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-[#e4e1e1] dark:bg-gray-800 rounded-2xl border-none relative">
                        <CardContent className="p-0 h-12 sm:h-[48px] flex items-center relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu"
                                className="w-full h-full bg-transparent border-none px-4 text-sm sm:text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                            />

                            {/* Icon mắt */}
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-10 sm:right-12 text-gray-600 dark:text-gray-300"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </CardContent>
                    </Card>

                    {/* Nút Quên mật khẩu? nằm phía dưới */}
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs sm:text-sm text-right text-black dark:text-white w-full"
                    >
                        Quên mật khẩu?
                    </button>
    {/*button login*/}
                    <div className="text-center px-4">
                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                            <FancyButton
                                text="Login"
                                variant="primary"
                                type="submit"
                                className="w-full sm:w-[600px] max-w-full h-[50px] relative text-xl sm:text-5xl tracking-[2.4px] font-bold "
                            />
                        </motion.div>
                    </div>
                </form>

                <p className="text-center mt-10 text-black dark:text-white text-sm sm:text-base">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Đăng ký
                    </a>
                </p>
            </motion.div>

            <footer className="text-center mt-10 px-6 text-black dark:text-white text-sm sm:text-xl pb-10">
                <p>
                    By registering on Infinity, you agree to our Policies and Privacy Policy.
                </p>
                <p className="mt-4">
                    This site is protected by reCAPTCHA consortium and is subject to the
                    Google Privacy Policy and Terms of Service.
                </p>
            </footer>
        </div>
    );
}