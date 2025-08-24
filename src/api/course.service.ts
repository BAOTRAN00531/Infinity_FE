// src/api/course.service.ts
import api from '@/api';
import {Course, Language} from '@/types';

// Lấy tất cả khóa học
export const getCourses = async (): Promise<Course[]> => {
    const res = await api.get<Course[]>('/api/courses');
    return res.data;
};


export const getLanguages = async (): Promise<Language[]> => {
    const res = await api.get<Language[]>('/api/languages');
    return res.data;
};

// Lấy chi tiết một khóa học
export const getCourseById = async (id: number): Promise<Course> => {
    const res = await api.get<Course>(`/api/courses/${id}`);
    return res.data;
};

export const getCoursesByLanguage = async (languageId: number): Promise<Course[]> => {
    const res = await api.get<Course[]>(`/api/courses/by-language/${languageId}`);
    return res.data;
};

// Tạo mới khóa học
// ✅ Cập nhật Omit để khớp với payload từ CourseForm
export const createCourse = async (
    courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'modulesCount'>
): Promise<void> => {
    await api.post('/api/courses', courseData);
};

// Cập nhật khóa học
// ✅ Cập nhật Omit để khớp với payload từ CourseForm
export const updateCourse = async (
    id: number,
    courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'modulesCount'>
): Promise<void> => {
    await api.put(`/api/courses/${id}`, courseData);
};

// Xóa khóa học
export const deleteCourse = async (id: number): Promise<void> => {
    await api.delete(`/api/courses/${id}`);
};
