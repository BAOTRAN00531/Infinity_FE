import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api'; // Sử dụng API instance
import { StudentModules } from './StudentModules';
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

export default function StudentCourses() {
    const { id: courseId } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!courseId || isNaN(Number(courseId))) {
            setError('Khóa học không hợp lệ');
            return;
        }

        api
            .get(`api/student/course/${courseId}`)
            .then((res) => setCourse(res.data))
            .catch((err) => {
                console.error('Lỗi tải khóa học:', err);
                setError('Không thể tải thông tin khóa học');
            });
    }, [courseId]);

    if (error) {
        return (
            <PageLayout>
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </PageLayout>
        );
    }

    if (!course) return <PageLayout><p className="text-center text-gray-500">Đang tải khóa học...</p></PageLayout>;

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
                <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-auto rounded shadow mb-4"
                />
                <div className="mb-4">
                    {/*<p><strong>Giá:</strong> {course.price.toLocaleString()} VNĐ</p>*/}
                    <p><strong>Số module:</strong> {course.totalModules}</p>
                    <p><strong>Hoàn thành:</strong> {course.completedModules}</p>
                    <div className="w-full bg-gray-200 rounded h-4 mt-2">
                        <div
                            className="bg-green-500 h-4 rounded"
                            style={{ width: `${course.progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.progressPercentage}% hoàn thành</p>
                </div>
                <StudentModules courseId={Number(courseId)} />
            </div>
        </PageLayout>
    );
}