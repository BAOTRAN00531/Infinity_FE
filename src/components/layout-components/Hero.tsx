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
            <div className="flex flex-col items-center justify-center mt-0">
                <div className="">
                    <img src="/black-cat.png" alt="black-cat" className="w-sm" />
                </div>
                <h4 className="font-bold text-xl text-center leading-8 text-slate-600 be-vietnam-pro-bold max-w-[550px]">
                    Xin chào, hãy để chúng mình trở thành bạn đồng hành trên con đường khám
                    phá ngôn ngữ của bạn nhé!
                </h4>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
                <FancyButton
                    text="Get started"
                    variant="primary"
                    to="/client/course"
                    className="h-12 px-6 w-full md:w-auto max-w-[300px] md:max-w-[400px] text-lg md:text-xl font-bold flex items-center justify-center"
                />

                <FancyButton
                    text="Let's go, I already have an account"
                    variant="secondary"
                    to="/login"
                    className="h-12 px-6 w-full md:w-auto max-w-[300px] md:max-w-[400px] text-base md:text-lg flex items-center justify-center"
                />
            </div>
        </motion.section>

    );
}

