// InfieFeature.tsx
import React from "react";
import { Card, CardContent } from "../reusable-components/card";
import { motion } from "framer-motion";
import FancyButton from "../button/FancyButton";
import { useNavigate } from "react-router-dom";

const productSections = [
    {
        title: "Infie's english test",
        description:
            "Our convenient, fast, and affordable English test will accurately test their English where and when they're at their best.",
        buttonText: "Let's go!",
        link: "/student/dashboard",
        media: (
            <img
                src="/home/cathello.gif"
                alt="GIF"
                className="max-w-full max-h-full object-contain"
            />
        )
    },
    {
        title: "Infie's spells",
        description:
            "From language to literacy! With fun phonics lessons and delightful stories, Infie's spells helps kids ages 3–8 learn to read and write — 100% free.",
        buttonText: "Learn more",
        link: "/client/course",
        media: (
            <img
                src="/home/cathello.gif"
                alt="GIF"
                className="max-w-full max-h-full object-contain"
            />
        )
    }
];

export default function InfieFeature() {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-gray-900 py-12 space-y-12">
            {productSections.map((product, index) => (
                <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`
            w-full max-w-[988px] 
            h-auto md:h-[530px] 
            flex flex-col md:flex-row 
            ${index % 2 === 0 ? "" : "md:flex-row-reverse"} 
            items-center justify-center 
            mx-auto px-4 gap-10 md:gap-24
          `}
                >
                    {/* Text block */}
                    <div
                        className="
              w-full max-w-[503px]
              space-y-4
              flex flex-col justify-center
              text-center md:text-left
            "
                    >
                        <h2 className="text-3xl font-bold mb-2 text-cyan-600 dark:text-cyan-400">
                            {product.title}
                        </h2>
                        <p className="text-muted-foreground text-lg dark:text-gray-300">
                            {product.description}
                        </p>
                        <div className="flex justify-center md:justify-start mt-4">
                            <FancyButton
                                text={product.buttonText}
                                variant="primary"
                                fullWidth={true}
                                onClick={() => navigate(product.link)}
                            />
                        </div>
                    </div>

                    {/* Media block */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center"
                    >
                        <Card className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gray-200 dark:bg-gray-700 border-none">
                            <CardContent className="h-full flex items-center justify-center text-xl font-semibold text-black dark:text-white">
                                {product.media}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.section>
            ))}
        </div>
    );
}
