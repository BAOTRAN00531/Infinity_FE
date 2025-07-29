// components/CartButton.tsx
import React from "react";
import { FaCartShopping } from "@/components/lib/icon"; // Cập nhật đúng path đến file icon
import { useNavigate } from "react-router-dom";

interface CartButtonProps {
    itemCount: number;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/cart")}
            className="relative p-2 text-gray-700 dark:text-white hover:text-blue-600"
            aria-label="Giỏ hàng"
        >
            <FaCartShopping className="text-xl" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </button>
    );
};

export default CartButton;
