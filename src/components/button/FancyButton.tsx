import React, {ReactNode} from "react";
import { Link } from "react-router-dom"; // hoặc next/link nếu bạn dùng Next.js
import "./FancyButton.css";

interface FancyButtonProps {
    text: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    to?: string; // 👉 Thêm: chuyển hướng nội bộ
    href?: string; // 👉 Thêm: chuyển hướng ngoài
    target?: string;
    disabled?: boolean;// 👉 cho external link
}

const FancyButton: React.FC<FancyButtonProps> = ({
                                                     text,
                                                     onClick,
                                                     variant = "primary",
                                                     size = "medium",
                                                     fullWidth = false,
                                                     className = "",
                                                     type = "button",
                                                     to,
                                                     href,
                                                     target,
                                                 }) => {
    const classes = `fancy-button ${variant} ${size} ${
        fullWidth ? "full-width" : ""
    } ${className}`;

    if (to) {
        // internal route
        return (
            <Link to={to} className={classes}>
                {text}
            </Link>
        );
    }

    if (href) {
        // external route
        return (
            <a href={href} target={target} rel="noopener noreferrer" className={classes}>
                {text}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} className={classes}>
            {text}
        </button>
    );
};

export default FancyButton;
