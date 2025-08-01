// Hero.tsx
import React from "react";
import { Button } from "../reusable-components/button";
import { motion } from "framer-motion";
import FancyButton from "@/components/button/FancyButton";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-white dark:bg-gray-900 py-24 px-6"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.img
                    src="/infinitylogo2-2.png"
                    alt="Infinity Logo"
                    className="w-full max-w-[400px] mx-auto object-contain"
                    whileHover={{ scale: 1.05 }}
                />

                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold leading-snug text-black dark:text-white">
                        <span>Chances are </span>
                        <span className="text-[#00a1a1]">INFINITE</span>
                        <span>
          <br />with languages. <br />To INFINITY and BEYOND<br />Today, get started.
        </span>
                    </h1>

                    <div className="flex flex-col items-center md:items-start gap-4 mt-8">
                        <FancyButton
                            text="Get started"
                            variant="primary"
                            to="/client/course"
                            className="w-full max-w-[300px] md:max-w-[400px] text-lg md:text-xl font-bold"
                        />

                        <FancyButton
                            text="Let's go, I already have an account"
                            variant="secondary"
                            to="/login"
                            className="w-full max-w-[300px] md:max-w-[400px] text-base md:text-lg"
                        />
                    </div>
                </div>
            </div>
        </motion.section>

    );
}

