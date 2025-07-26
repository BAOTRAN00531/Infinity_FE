import React from "react";
import classNames from "classnames";

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
            <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(value, 100)}%` }}
            />
        </div>
    );
};
