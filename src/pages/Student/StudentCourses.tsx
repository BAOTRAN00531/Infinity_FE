// src/components/student/course/StudentCourses.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api';
import { StudentModules } from './StudentModules';
import PageLayout from '@/components/layout-components/PageLayout';
import { motion } from 'framer-motion';
import { Progress } from "@/components/reusable-components/progress";
import { FiArrowLeft, FiBook, FiClock, FiCheckCircle, FiBarChart2, FiPlay } from 'react-icons/fi';
import {Button} from "@headlessui/react";
import FancyButton from "@/components/button/FancyButton";

// ✅ Cập nhật interface để match với API response
export interface Module {
    id: number;
    name: string;
    description: string;
    courseId: number;
    courseName: string;
    order: number;
    duration: string | null;
    status: string;
    partsCount: number;
}

export interface CourseDetail {
    courseId: number;
    courseName: string;
    thumbnail: string;
    modules: Module[];
}

export interface Lesson {
    id: number;
    name: string;
    description: string | null;
    content: string;
    type: string;
    videoUrl: string;
    orderIndex: number;
    duration: string;
    status: string;
    isCompleted: boolean;
    moduleId: number;
    moduleName: string;
    createdBy: number;
    createdAt: string;
    updatedBy: number;
    updatedAt: string;
}

export default function StudentCourses() {
    const { id: courseId } = useParams<{ id: string }>();
    const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [totalModules, setTotalModules] = useState<number>(0);
    const [completedModules, setCompletedModules] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ Hàm tính toán modules hoàn thành
    const calculateModuleProgress = async (modules: Module[]) => {
        let completed = 0;

        // Duyệt qua từng module để kiểm tra completion
        for (const module of modules) {
            try {
                const response = await api.get(`/api/student/lesson/by-module/${module.id}`);
                const lessons: Lesson[] = response.data;

                // Nếu tất cả lessons trong module đều completed
                if (lessons.length > 0 && lessons.every(lesson => lesson.isCompleted)) {
                    completed++;
                }
            } catch (error) {
                console.error(`Error fetching lessons for module ${module.id}:`, error);
            }
        }

        return completed;
    };

    // ✅ Hàm tính toán progress percentage
    const calculateOverallProgress = async (modules: Module[]) => {
        let totalLessons = 0;
        let completedLessons = 0;

        for (const module of modules) {
            try {
                const response = await api.get(`/api/student/lesson/by-module/${module.id}`);
                const lessons: Lesson[] = response.data;

                totalLessons += lessons.length;
                completedLessons += lessons.filter(lesson => lesson.isCompleted).length;
            } catch (error) {
                console.error(`Error fetching lessons for module ${module.id}:`, error);
            }
        }

        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    };

    useEffect(() => {
        if (!courseId || isNaN(Number(courseId))) {
            setError('Khóa học không hợp lệ');
            setLoading(false);
            return;
        }

        const fetchCourseData = async () => {
            try {
                // Gọi API để lấy thông tin khóa học và modules
                const courseResponse = await api.get(`/api/student/course/${courseId}`);
                const courseData: CourseDetail = courseResponse.data;

                setCourseDetail(courseData);
                setTotalModules(courseData.modules.length);

                // Tính toán modules hoàn thành và progress
                const [completedCount, progressPercentage] = await Promise.all([
                    calculateModuleProgress(courseData.modules),
                    calculateOverallProgress(courseData.modules)
                ]);

                setCompletedModules(completedCount);
                setProgress(progressPercentage);

            } catch (err) {
                console.error("API Error:", err);
                setError("Không thể tải thông tin khóa học hoặc tiến độ.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    if (loading) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    <div className="bg-red-50 p-6 rounded-lg max-w-md">
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <FiArrowLeft className="mr-2" />
                            Quay lại Dashboard
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!courseDetail) return null;

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header với nút quay lại */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                    >
                        <FiArrowLeft className="mr-2" />
                        Quay lại Dashboard
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="md:flex">
                        {/* Thông tin khóa học và hình ảnh */}
                        <div className="md:w-2/5">
                            <img
                                src={courseDetail.thumbnail}
                                alt={courseDetail.courseName}
                                className="w-full h-64 md:h-full object-cover"
                            />
                        </div>

                        {/* Thanh tiến độ và số liệu */}
                        <div className="md:w-3/5 p-6 md:p-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{courseDetail.courseName}</h1>
                            <p className="text-gray-600 mb-6">
                                Chào mừng bạn đến với khóa học, hãy bắt đầu hành trình học tập của mình!
                            </p>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FiBarChart2 className="mr-2 text-blue-500" />
                                    Tiến độ khóa học của bạn
                                </h2>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Hoàn thành</span>
                                        <span>{progress.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                        <div className="flex items-center justify-center">
                                            <FiBook className="text-blue-500 mr-2" />
                                            <span className="text-2xl font-bold">{totalModules}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Tổng modules</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                        <div className="flex items-center justify-center">
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span className="text-2xl font-bold">{completedModules}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Modules hoàn thành</p>
                                    </div>
                                </div>

                                {/* Nút bắt đầu học */}
                                <div className="mt-6 flex justify-center">
                                    <FancyButton
                                        onClick={() => navigate(`/student/learn/${courseId}`)}
                                        variant="primary"
                                        size="medium"
                                        fullWidth={false}
                                        text={
                                            <>
                                                <FiPlay className="mr-2" />
                                                Bắt đầu học
                                            </>
                                        }
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Nội dung khóa học */}
                    <div className="p-6 md:p-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <FiPlay className="mr-2 text-blue-500" />
                            Nội dung khóa học
                        </h2>

                        <StudentModules courseId={Number(courseId)} />
                    </div>
                </motion.div>
            </div>
        </PageLayout>
    );
}