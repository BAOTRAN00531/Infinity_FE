// src/pages/student/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import PageLayout from '@/components/layout-components/PageLayout';

export interface Course {
    courseId: number;
    courseName: string;
    thumbnail: string;
    price: number;
    totalModules: number;
    completedModules: number;
    progressPercentage: number;
}



const UserDashboard = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        axios.get('/api/student/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setCourses(res.data))
            .catch(err => console.error('Lỗi khi load dashboard:', err))
            .finally(() => setLoading(false));
    }, []);


    if (loading) return <div>Đang tải...</div>;

    return (
        <PageLayout>

        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Khóa học của bạn</h2>

            {courses.length === 0 ? (
                <div className="text-center text-gray-600 p-8 border rounded-xl bg-gray-50 shadow-sm">
                    <p className="text-lg font-medium mb-2">Bạn chưa mua khóa học nào.</p>
                    <button
                        onClick={() => navigate('/client/course')}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                        Mua thêm khóa học
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.courseId}
                            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                            onClick={() => navigate(`/student/course/${course.courseId}`)}
                        >
                            <img
                                src={course.thumbnail}
                                alt={course.courseName}
                                className="w-full h-40 object-cover rounded-xl mb-4"
                            />
                            <h3 className="text-lg font-bold mb-1">{course.courseName}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Tiến độ: {course.completedModules}/{course.totalModules} modules (
                                {Math.round(course.progressPercentage)}%)
                            </p>
                            <div className="text-sm font-medium text-gray-700">
                                Giá: {course.price.toLocaleString()}₫
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </PageLayout>
    );
};

export default UserDashboard;