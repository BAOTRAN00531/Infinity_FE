
import { OrderResponse } from "@/pages/Admin/OrderCRUD";
import { DialogHeader, DialogTitle } from "@/components/reusable-components/dialog";
import {Badge, CheckCircle} from "lucide-react";
import { Button_admin } from "@/components/reusable-components/button_admin";

type Props = {
    order: OrderResponse;
    onApprove?: () => void;
};

const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    failed: 'bg-gray-100 text-gray-600 border-gray-200',
};




const OrderDetail = ({ order, onApprove }: Props) => {
    return (
        <div className="space-y-4 text-sm">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Chi tiết đơn hàng</DialogTitle>
            </DialogHeader>

            <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn:</span>
                <span className="font-medium">{order.orderCode}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Khóa học:</span>
                <span className="font-medium">{order.courseName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium">{order.totalAmount.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="font-medium">{new Date(order.orderDate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge className={`text-xs font-medium rounded-full ${statusColor[order.status] || ''}`}>
                    {order.status}
                </Badge>
            </div>

            {order.status === "pending" && (
                <div className="flex justify-end">
                    <Button_admin
                        className="bg-green-500 hover:bg-green-600 text-white mt-4"
                        onClick={onApprove}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Duyệt đơn
                    </Button_admin>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
