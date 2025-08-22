import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains("dark");
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
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
