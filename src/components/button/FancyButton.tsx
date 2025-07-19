import React from "react";
import "./FancyButton.css";

interface FancyButtonProps {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    className?: string; // 👉 Thêm
}

const FancyButton: React.FC<FancyButtonProps> = ({
                                                     text,
                                                     onClick,
                                                     variant = "primary",
                                                     size = "medium",
                                                     fullWidth = false,
                                                     className = "", // 👉 Thêm
                                                 }) => {
    return (
        <button
            className={`fancy-button ${variant} ${size} ${fullWidth ? "full-width" : ""} ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default FancyButton;
