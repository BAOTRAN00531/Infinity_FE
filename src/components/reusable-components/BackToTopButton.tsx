import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronUp } from "react-icons/fa";

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.scrollY > 300);
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ép type để tránh lỗi TS2786
    const Icon = FaChevronUp as unknown as React.FC<{ size?: number; className?: string }>;

    return (
        <>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
                >
                    <Icon size={20} />
                </motion.button>
            )}
        </>
    );
};

export default BackToTopButton;
