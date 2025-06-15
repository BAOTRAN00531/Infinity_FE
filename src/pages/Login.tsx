import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import Header from "../components/Header";
import { Link } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Gửi request đăng nhập ở đây
            // const res = await login(formData)
            // navigate("/")
        } catch (err) {
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
    };

    return (


        <div className="bg-white dark:bg-gray-900 flex flex-col min-h-screen">
            <Header />

            <div className="absolute top-4 right-4 flex gap-3">


                <motion.a
                    href="/register"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <button
                        className="relative w-[120px] h-[50px] bg-[100%_100%]"
                        style={{ backgroundImage: "url('/3d-button-3.png')", backgroundSize: "100% 100%" }}
                    >
            <span className="absolute inset-0 flex items-center justify-center transform -translate-y-[14%] text-black font-semibold text-sm">
              Register
            </span>
                    </button>
                </motion.a>
            </div>


            <motion.div
                className="flex-1 flex flex-col items-center justify-center px-4 py-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >




                <h1 className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white mb-8 tracking-widest">
                    LOGIN
                </h1>



                {error && <p className="text-red-500 mb-4">{error}</p>}

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
                        <CardContent className="p-0 h-12 sm:h-[48px] flex items-center">
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu"
                                className="w-full h-full bg-transparent border-none px-4 text-sm sm:text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="absolute right-2 sm:right-4 text-xs sm:text-sm text-black dark:text-white"
                            >
                                Quên ?
                            </button>
                        </CardContent>
                    </Card>


                    <div className="text-center px-4">
                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
                            <Button
                                type="submit"
                                className="w-full sm:w-[600px] max-w-full h-[60px] sm:h-[126px] bg-[100%_100%] relative"
                                style={{
                                    backgroundImage: "url('/3d-button.png')",
                                    backgroundSize: "100% 100%",
                                }}
                            >
                        <span className="absolute inset-0 flex items-center justify-center transform -translate-y-[14%] font-bold text-black text-xl sm:text-5xl tracking-[2.4px]">
                          Login
                        </span>

                            </Button>
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
