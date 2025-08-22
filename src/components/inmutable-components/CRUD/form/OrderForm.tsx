import { useForm } from "react-hook-form";
import { Button_admin } from "@/components/reusable-components/button_admin";
import { toast } from "react-toastify";
import { OrderResponse } from "@/pages/Admin/OrderCRUD";
import api from "@/api"; // ✅ dùng instance đã có baseURL và token

type CreateOrderForm = {
    courseId: number;
    paymentMethod: string;
};

type Props = {
    initialData?: OrderResponse;
    onSuccess: () => void;
    onCancel: () => void;
};

const OrderForm = ({ initialData, onSuccess, onCancel }: Props) => {
    const { register, handleSubmit, reset } = useForm<CreateOrderForm>({
        defaultValues: {
            courseId: initialData?.courseId || 0,
            paymentMethod: initialData?.paymentMethod || "CASH",
        },
    });

    const onSubmit = async (data: CreateOrderForm) => {
        try {
            if (initialData) {
                // Chỉnh sửa
                await api.put(`/api/orders/update?orderCode=${initialData.orderCode}`, data);
                toast.success("Đã cập nhật đơn hàng", { autoClose: 1200 });
            } else {
                // Tạo mới
                await api.post("/api/orders/create", data);
                toast.success("Đã tạo đơn hàng", { autoClose: 1200 });
            }

            onSuccess();
        } catch (error) {
            console.error("❌ Lỗi khi tạo/cập nhật đơn hàng:", error);
            toast.error("Thao tác thất bại", { autoClose: 1200 });
        }
    };

    return (
        <div className="p-6 max-w-md bg-white rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold">
                {initialData ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Course ID */}
                <div>
                    <label className="block text-sm font-medium">Course ID</label>
                    <input
                        type="number"
                        {...register("courseId", { required: true })}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block text-sm font-medium">Phương thức thanh toán</label>
                    <select
                        {...register("paymentMethod", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="CASH">Tiền mặt</option>
                        <option value="MOMO">MOMO</option>
                        <option value="VNPAY">VNPAY</option>
                        <option value="SEPAY">SePay</option>

                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button_admin type="button" onClick={onCancel} variant="outline">
                        Hủy
                    </Button_admin>
                    <Button_admin
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {initialData ? "Cập nhật" : "Tạo"}
                    </Button_admin>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;