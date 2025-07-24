// src/types/order.ts

export interface OrderResponse {
    orderCode: string;
    status: string;
    paymentMethod: string;
    totalAmount: number;
    orderDate: string;
}

export interface CreateOrderRequest {
    userId: number;
    courseId: number;
    paymentMethod: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
}
