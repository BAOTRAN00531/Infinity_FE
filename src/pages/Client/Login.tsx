import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/reusable-components/card";
import { Input } from "@/components/reusable-components/input";
import Header from "@/components/layout-components/Header";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "@/components/lib/icon";
import { login } from "@/authService";
import { jwtDecode } from "jwt-decode";
import FancyButton from "@/components/button/FancyButton";
import { toast } from "react-toastify";
import { UserLogin } from "@/types"; // Đảm bảo đúng đường dẫn

interface LoginResponse {
    access_token: string;
    userp: UserLogin;
}

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res: LoginResponse = await login(formData);
            const decodedToken: any = jwtDecode(res.access_token);
            const role: string = decodedToken.role;

            // Ghi role vào user để Header có thể đọc đúng
            const userWithRole: UserLogin = {
                ...res.userp,
                role,
            };

            if (rememberMe) {
                localStorage.setItem("user", JSON.stringify(userWithRole));
                localStorage.setItem("access_token", res.access_token);
                // Đồng bộ sessionStorage
                sessionStorage.setItem("user", JSON.stringify(userWithRole));
                sessionStorage.setItem("access_token", res.access_token);
            } else {
                sessionStorage.setItem("user", JSON.stringify(userWithRole));
                sessionStorage.setItem("access_token", res.access_token);
            }

            toast.success("Đăng nhập thành công!", {
                autoClose: 1200, // 👈 1.2 giây riêng lẻ
            });

            console.log("Token:", res.access_token);
            console.log("Decoded role:", role);
            console.log("User:", userWithRole);

            // Điều hướng luôn, không dùng setTimeout
            if (role === "ROLE_ADMIN") {
                const baseUrl = process.env.REACT_APP_BASE_URL;
                if (!rememberMe) {
                    window.location.href = `${baseUrl}/admin/dashboard`;
                } else {
                    navigate("/admin/dashboard");
                }
            } else {
                navigate("/");
            }
        } catch (err: any) {
            toast.error("Đăng nhập thất bại. Vui lòng thử lại.", {
                autoClose: 1200, // 👈 1.2 giây riêng lẻ
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        if (!backendUrl) {
            alert("❌ Backend URL không được cấu hình. Kiểm tra file .env.local.");
            return;
        }
        window.location.href = `${backendUrl}/oauth2/authorization/google`;
    };

    const handleFacebookLogin = () => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        if (!backendUrl) {
            alert("❌ Backend URL không được cấu hình. Kiểm tra file .env.local.");
            return;
        }
        window.location.href = `${backendUrl}/oauth2/authorization/facebook`;
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
                    LOGIN
                </h1>

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 mx-auto">
                    {/* Username */}
                    <Card className="bg-gray-100 dark:bg-gray-800 rounded-2xl border-none">
                        <CardContent className="p-0 h-12 flex items-center">
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Email hoặc tên đăng nhập"
                                className="w-full h-full bg-transparent border-none px-4 text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
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
                                placeholder="Mật khẩu"
                                className="w-full h-full bg-transparent border-none px-4 text-sm text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
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

                    {/* Remember me + Forgot */}
                    <div className="flex justify-between items-center text-xs text-black dark:text-white">
                        <label className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Nhớ tôi
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit */}
                    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                        <FancyButton
                            text={
                                loading ? (
                                    <span className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                      />
                      <path
                          d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
                          fill="currentColor"
                      />
                    </svg>
                    Đang đăng nhập...
                  </span>
                                ) : (
                                    "Đăng nhập"
                                )
                            }
                            variant="primary"
                            type="submit"
                            className="w-full h-[50px] text-lg tracking-wide font-bold"
                            disabled={loading}
                            fullWidth
                        />
                    </motion.div>

                    {/* Google Login */}
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        className="mt-4"
                    >
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full h-[50px] flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                        >
                            <FaGoogle />
                            Đăng nhập với Google
                        </button>
                    </motion.div>

                    {/* Facebook Login */}
                    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="w-full mt-3 h-[50px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                        >
                            <FaFacebook />
                            Đăng nhập với Facebook
                        </button>
                    </motion.div>
                </form>

                <p className="text-center mt-10 text-black dark:text-white text-sm">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Đăng ký
                    </a>
                </p>
            </motion.div>

            <footer className="text-center mt-10 px-6 text-black dark:text-white text-xs pb-10">
                <p>
                    By logging in to Infinity, you agree to our Policies and Privacy
                    Policy.
                </p>
                <p className="mt-2">
                    This site is protected by reCAPTCHA and subject to the Google Privacy
                    Policy and Terms of Service.
                </p>
            </footer>
        </div>
    );
}
