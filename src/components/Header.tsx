// Header.tsx
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useNavigate,useLocation ,Link } from "react-router-dom";

interface HeaderProps {
    welcomeMessage?: string;
}

export default function Header({ welcomeMessage }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [userName, setUserName] = useState<string | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Lấy tên người dùng từ localStorage nếu đã đăng nhập
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsed = JSON.parse(userData);
            setUserName(parsed.name || null);
        }
    }, [location]);

    const handleLogout = async () => {
        localStorage.removeItem("token");
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
                    <img src="/image-2-1.png" alt="Lang" className="w-5 h-5" />
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
                    ) : null}

                    {!token && (
                        <div className="max-w-4xl mx-auto py-6 px-6 text-center">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-center"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 text-center"
                                >
                                    Đăng ký
                                </Link>
                            </div>
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




// // Header.tsx
// import React from "react";
// import ThemeToggle from "./ThemeToggle";
//
// export default function Header() {
//     return (
//         <header className="w-full p-4 bg-white dark:bg-gray-900 shadow flex justify-center font-bold text-xl">
//             <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-2">
//                 <div className="flex items-center gap-4">
//                     <img src="/infinity-1.png" alt="Logo" className="w-10 h-10" />
//                     <span className="text-black dark:text-white tracking-widest">INFINITY</span>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                         <span>Site language: English</span>
//                         <img src="/image-2-1.png" alt="Lang" className="w-5 h-5" />
//                     </div>
//                     <ThemeToggle />
//                 </div>
//             </div>
//         </header>
//     );
// }

// import React from "react";
// import ThemeToggle from "./ThemeToggle";
//
// export default function Header() {
//     return (
//         <header className="w-full p-4 bg-white shadow flex justify-center font-bold text-xl">
//             <div className="max-w-7xl w-full flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                     <img src="/infinity-1.png" alt="Logo" className="w-10 h-10" />
//                     <span className="text-black tracking-widest">INFINITY</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <span>Site language: English</span>
//                     <img src="/image-2-1.png" alt="Lang" className="w-5 h-5" />
//                 </div>
//             </div>
//             <ThemeToggle />
//         </header>
//     );
// }
// import React from "react";
// export default function Header() {
//     return (
//         <header className="w-full p-4 bg-gray-100 text-center font-bold text-xl">
//             Header
//         </header>
//     );
// }