// CTA.tsx
import React from "react";
import { motion } from "framer-motion";
import FancyButton from "../button/FancyButton";

export default function CTA() {
    return (
        <motion.section
            className="w-full bg-gray-100 dark:bg-gray-800 py-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Learn a language with Infinity
            </h2>
            <FancyButton
                className="mt-6 text-xl font-bold"
                text="GET STARTED"
                variant="primary"
                onClick={() => {
                    window.scrollTo({ top: 300, behavior: "smooth" });
                }}
            />

            <img
                src="/infinitylogo2-2.png"
                alt="Infinity Logo"
                className="mx-auto mt-8 w-48 h-48 object-contain"
            />
        </motion.section>
    );
}
