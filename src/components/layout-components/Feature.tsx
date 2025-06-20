// Feature.tsx
import React from "react";
import { Card, CardContent } from "../reusable-components/card";
import { motion } from "framer-motion";

const features = [
    {
        title: "free > fun > depends on you",
        description:
            "Learning with Infinity is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels all while gaining real-world communication skills.",
    },
    {
        title: "Backed by Researches",
        description:
            "We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening and speaking skills!",
    },
    {
        title: "Stay motivated",
        description:
            'We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our "friendly" mascot, Infie the cat.',
    },
    {
        title: "Trusted by the Pros",
        description:
            "We offer a real world needs based teaching program to create courses that effectively improves reading, writing, listening and speaking skills for aviation pros",
    },
];

export default function Feature() {
    return (
        <div className="bg-white dark:bg-gray-900 py-12 space-y-16">
            {features.map((feature, index) => (
                <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} items-center justify-between px-4 md:px-32 gap-8`}
                >
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{feature.title}</h2>
                        <p className="text-muted-foreground text-lg dark:text-gray-300">{feature.description}</p>
                    </div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.3 }}
                        viewport={{ once: true }}
                    >
                        <Card className="w-[300px] h-[300px] bg-gray-200 dark:bg-gray-700 border-none">
                            <CardContent className="h-full flex items-center justify-center text-xl font-semibold text-black dark:text-white">
                                Media
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.section>
            ))}
        </div>
    );
}

