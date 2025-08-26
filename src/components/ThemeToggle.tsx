import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Lấy theme từ localStorage khi load
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        // Áp dụng theme khi state thay đổi + lưu vào localStorage
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-sm dark:text-white text-gray-800 shadow hover:scale-105 transition"
        >
            {isDark ? "☀️" : "🌙"}
        </button>
    );
}
