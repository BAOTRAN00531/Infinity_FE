import React from "react";
import { motion } from "framer-motion";

export default function HeroBanners() {
    return (
        <div className="w-full">
            {/* Banner 1 */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative w-full min-h-[1120px] bg-gradient-to-b from-cyan-500 to-blue-700 flex flex-col justify-center items-center px-4"
            >
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
                    Chances are <span className="text-green-300">INFINITE</span>
                </h1>
                <p className="text-lg md:text-xl text-white text-center max-w-2xl">
                    To infinity and beyond — Start learning today!
                </p>
                <motion.img
                    src="/home/cathello.gif"
                    alt="Animated Cat"
                    className="w-[300px] md:w-[400px] mt-12"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                />
                <div className="absolute bottom-8 animate-bounce">
                    <span className="text-white text-lg">↓ Scroll down</span>
                </div>
            </motion.section>

            {/* Banner 2 */}
            <section
                className="relative w-full min-h-[984px] bg-gray-100 dark:bg-gray-800 flex flex-col justify-center items-center px-4"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Special Offer!
                </h2>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center max-w-2xl">
                    Grab your premium account now and unlock all features.
                </p>
                <button className="mt-8 px-8 py-4 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700 text-lg">
                    Buy Now
                </button>
                <img
                    src="/home/banner2-image.png"
                    alt="Banner 2 Ad"
                    className="w-[300px] md:w-[400px] mt-12"
                />
            </section>
        </div>
    );
}
