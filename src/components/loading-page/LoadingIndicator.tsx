// src/components/LoadingIndicator.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    FaSpinner,
    FaSnowflake,
    FaCircleNotch
} from "react-icons/fa";

// ✅ Ép kiểu mỗi icon rõ ràng
const SpinnerIcon = FaSpinner as React.FC<React.SVGProps<SVGSVGElement>>;
const SnowflakeIcon = FaSnowflake as React.FC<React.SVGProps<SVGSVGElement>>;
const CircleNotchIcon = FaCircleNotch as React.FC<React.SVGProps<SVGSVGElement>>;

// ✅ Array các icon đã ép kiểu sẵn
const ICONS = [SpinnerIcon, SnowflakeIcon, CircleNotchIcon];

export default function LoadingIndicator() {
    const [loading, setLoading] = useState(false);
    const [iconIndex, setIconIndex] = useState(0);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        setIconIndex(Math.floor(Math.random() * ICONS.length));
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const Icon = ICONS[iconIndex];

    return (
        <>
            {/* Top progress bar */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="progress"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed top-0 left-0 h-1 bg-cyan-400 z-[9999]"
                    />
                )}
            </AnimatePresence>

            {/* Overlay with animated icon */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-[9998] flex items-center justify-center pointer-events-none"
                    >

                        <motion.div
                            initial={{ scale: 0.8, rotate: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0.8 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="text-cyan-400 text-5xl"
                        >
                            <Icon className="w-16 h-16" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
