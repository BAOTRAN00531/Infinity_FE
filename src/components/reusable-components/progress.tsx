// src/components/reusable-components/progress.tsx

import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion"; // ✅ Import motion

interface ProgressProps {
    value: number; // từ 0 đến 100
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
    return (
        <div
            className={classNames(
                "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden h-4",
                className
            )}
        >
            <motion.div
                className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(value, 100)}%` }} // ✅ Sử dụng animate để tạo hiệu ứng chuyển động
                transition={{ duration: 0.8, ease: "easeInOut" }} // ✅ Tùy chỉnh hiệu ứng chuyển động
            />
        </div>
    );
};