// components/history/OrderHistoryButton.tsx
import React from "react";
import { FaClockRotateLeft } from "@/components/lib/icon";
import { useNavigate } from "react-router-dom";

const OrderHistoryButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/order-history")}
            className="relative p-2 text-gray-700 dark:text-white hover:text-blue-600"
            aria-label="Lịch sử đơn hàng"
        >
            <FaClockRotateLeft className="text-xl" />
        </button>
    );
};

export default OrderHistoryButton;
