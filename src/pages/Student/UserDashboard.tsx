import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout-components/PageLayout';
import api from '@/api';

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

    if (loading) return <PageLayout><div className="text-center">Đang tải...</div></PageLayout>;

    if (error) {
        return (
            <PageLayout>
                <div className="text-center text-red-500">{error}</div>
            </PageLayout>
        );
    }

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