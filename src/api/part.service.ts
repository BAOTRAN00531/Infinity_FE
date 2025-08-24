// src/api/part.service.ts

import api from '@/api';
import { Part, PartRequest } from '@/types'; // Assumed you've defined these types

// Lấy tất cả các Part (bài học), có thể lọc theo moduleId
export const fetchParts = async (moduleId?: number): Promise<Part[]> => {
    const params = moduleId ? { moduleId } : {};
    const response = await api.get<Part[]>('/api/lessons', { params });
    return response.data;
};

// Lấy chi tiết một Part bằng ID
export const fetchPartById = async (id: number): Promise<Part> => {
    const response = await api.get<Part>(`/api/lessons/${id}`);
    return response.data;
};

// Tạo một Part mới
export const createPart = async (data: PartRequest): Promise<Part> => {
    const response = await api.post<Part>('/api/lessons', data);
    return response.data;
};

// Cập nhật một Part
export const updatePart = async (id: number, data: PartRequest): Promise<Part> => {
    const response = await api.put<Part>(`/api/lessons/${id}`, data);
    return response.data;
};

// Xóa một Part
export const deletePart = async (id: number): Promise<void> => {
    await api.delete(`/api/lessons/${id}`);
};