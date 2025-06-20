import React, { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface HeaderProps {
    welcomeMessage?: string;
}

export default function Header({ welcomeMessage }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState<string | null>(null);
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsed = JSON.parse(userData);
            setUserName(parsed.name || null);
        }
    }, [location]);

    const handleLogout = async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        document.cookie = "refresh_token=; Max-Age=0; path=/";
        navigate("/login");
    };

    return (
        <header className="w-full p-4 bg-white dark:bg-gray-900 shadow text-xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                <Link to="/">
                    <div className="flex items-center gap-4">
                        <img src="/infinity-1.png" alt="Logo" className="w-10 h-10" />
                        <span className="text-black dark:text-white tracking-widest">
              INFINITY
            </span>
                    </div>
                </Link>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>Site language: English</span>
                    <img
                        src="/image-2-1.png"
                        alt="Lang"
                        className="w-5 h-5 rotate-90"
                    />
                    <ThemeToggle />

                    {token ? (
                        <div className="flex items-center gap-2">
                            <img
                                src="/avatar.png"
                                alt="Avatar"
                                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                            />
                            {userName && (
                                <span className="text-black dark:text-white font-medium">
        {userName}
      </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <button
                                    className="w-36 h-12 text-lg font-bold text-black"
                                    style={{
                                        backgroundImage: "url('/3d-button-4.png')",
                                        backgroundSize: "100% 100%",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="-translate-y-[14%]">Đăng nhập</div>
                                </button>
                            </Link>

                            <Link to="/register">
                                <button
                                    className="w-36 h-12 text-lg font-bold text-black"
                                    style={{
                                        backgroundImage: "url('/3d-button-3.png')",
                                        backgroundSize: "100% 100%",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="-translate-y-[14%]">Đăng ký</div>
                                </button>
                            </Link>
                        </div>
                    )}




                </div>
            </div>
            {welcomeMessage && (
                <div className="text-center mt-4 text-green-600 dark:text-green-400 text-base">
                    {welcomeMessage}
                </div>
            )}
        </header>
    );
}
