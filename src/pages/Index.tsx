// Index.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Feature from "../components/Feature";
import InfieFeature from "../components/InfieFeature";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Index() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    const handleLogin = () => navigate("/login");
    const handleRegister = () => navigate("/register");

    return (
        <main className="bg-white dark:bg-gray-900">
            <Header
                welcomeMessage={
                    token ? "Chào mừng bạn đã đăng nhập!" : "Chào mừng bạn đến với trang chủ!"
                }
            />
            {!token && (
                <div className="max-w-4xl mx-auto py-6 px-6 text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleLogin}
                            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Đăng nhập
                        </button>
                        <button
                            onClick={handleRegister}
                            className="px-5 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
            )}
            <Hero />
            <LanguageSwitcher />
            <Feature />
            <InfieFeature />
            <CTA />
            <Footer />
        </main>
    );
}
