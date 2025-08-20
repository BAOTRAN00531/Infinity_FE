import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout-components/PageLayout';
import api from '@/api';
import { motion } from 'framer-motion';
import { FiBook, FiCheckCircle, FiArrowRight, FiPlusCircle, FiBarChart2 } from 'react-icons/fi';

export interface Course {
    courseId: number;
    courseName: string;
    thumbnail: string;
    price: number;
    totalModules: number;
    completedModules: number;
    progressPercentage: number;
}

const UserDashboard: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get('api/student/dashboard')
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error('Lỗi khi load dashboard:', err);
                setError('Không thể tải danh sách khóa học');
            })
            .finally(() => setLoading(false));
    }, []);

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
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="bg-red-50 p-6 rounded-lg text-center">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard của bạn</h1>
                    <p className="text-gray-600">Theo dõi tiến độ học tập và tiếp tục các khóa học của bạn</p>
                </div>

                {courses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto"
                    >
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiBook className="text-blue-500 text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bạn chưa có khóa học nào</h3>
                        <p className="text-gray-600 mb-6">Bắt đầu hành trình học tập của bạn ngay hôm nay</p>
                        <button
                            onClick={() => navigate('/client/course')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto"
                        >
                            <FiPlusCircle className="mr-2" />
                            Khám phá khóa học
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Thống kê tổng quan */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <FiBook className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tổng số khóa học</p>
                                        <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Modules đã hoàn thành</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {courses.reduce((total, course) => total + course.completedModules, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                        <FiBarChart2 className="text-purple-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Tiến độ trung bình</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {Math.round(courses.reduce((total, course) => total + course.progressPercentage, 0) / courses.length)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách khóa học */}
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Khóa học của bạn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course, index) => (
                                <motion.div
                                    key={course.courseId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                    onClick={() => navigate(`/student/course/${course.courseId}`)}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                            <h3 className="text-lg font-bold text-white line-clamp-2">{course.courseName}</h3>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Tiến độ</span>
                                                <span>{Math.round(course.progressPercentage)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700"
                                                    style={{ width: `${course.progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                                            <div className="flex items-center">
                                                <FiCheckCircle className="text-green-500 mr-1" />
                                                <span>{course.completedModules}/{course.totalModules} modules</span>
                                            </div>
                                            <div className="font-semibold text-blue-600">
                                                {course.price > 0 ? `${course.price.toLocaleString()}₫` : 'Miễn phí'}
                                            </div>
                                        </div>

                                        <button className="w-full flex items-center justify-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition group-hover:bg-blue-100">
                                            <span className="mr-2">Tiếp tục học</span>
                                            <FiArrowRight />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default UserDashboard;