// InfieFeature.tsx
import React from "react";
import { Button } from "../reusable-components/button";
import { Card, CardContent } from "../reusable-components/card";
import { motion } from "framer-motion";

const productSections = [
    {
        title: "Infie's english test",
        description:
            "Our convenient, fast, and affordable English test will accurately test their English where and when they're at their best.",
        buttonText: "Let's go!",
        image: "/3d-button-4.png",
    },
    {
        title: "Infie's spells",
        description:
            "From language to literacy! With fun phonics lessons and delightful stories, Infie's spells helps kids ages 3–8 learn to read and write — 100% free.",
        buttonText: "Learn more",
        image: "/3d-button-1.png",
    },
];



export default function InfieFeature() {
    return (
        <div className="bg-white dark:bg-gray-900 py-12 space-y-12">
            {productSections.map((product, index) => (
                <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`flex flex-col-reverse md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center justify-between px-4 md:px-32 gap-8`}
                >
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            {product.title}
                        </h2>
                        <p className="text-muted-foreground text-lg dark:text-gray-300">
                            {product.description}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button
                                className="relative mt-4 w-[250px] h-14 sm:h-[80px] bg-[100%_100%] text-base font-semibold"
                                style={{
                                    backgroundImage: `url(${product.image})`,
                                    backgroundSize: "100% 100%",
                                }}
                            >
      <span className="absolute inset-0 flex items-center justify-center transform -translate-y-[14%] text-black font-semibold text-base sm:text-lg tracking-wide">
        {product.buttonText}
      </span>
                            </button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.3 }}
                        viewport={{ once: true }}
                    >
                        <Card className="w-full md:w-[300px] h-[300px] bg-gray-200 dark:bg-gray-700 border-none">
                            <CardContent className="h-full flex items-center justify-center text-xl font-semibold text-gray-800 dark:text-white">
                                Media
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.section>
            ))}
        </div>
    );
}

