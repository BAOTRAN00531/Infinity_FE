// src/components/student/course/StudentLessons.tsx

import { useEffect, useState } from 'react';
import api from '@/api';
import { FiPlay, FiCheckCircle, FiClock, FiLock, FiArrowRight } from 'react-icons/fi';

export interface StudentLesson {
    id: number;
    name: string;
    description: string;
    content: string;
    type: string;
    orderIndex: number;
    duration: string;
    status: string;
    moduleId: number;
    moduleName: string;
    isCompleted: boolean;
    videoUrl?: string;
    resourcesCount: number;
}

interface StudentLessonsProps {
    moduleId: number;
}

export function StudentLessons({ moduleId }: StudentLessonsProps) {
    const [lessons, setLessons] = useState<StudentLesson[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

    useEffect(() => {
        api
            .get(`/api/student/lesson/by-module/${moduleId}`)
            .then((res) => {
                setLessons(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Lỗi tải bài học:', err);
                setError('Không thể tải danh sách bài học');
                setLoading(false);
            });
    }, [moduleId]);

    const handleLessonClick = (lessonId: number) => {
        setSelectedLesson(lessonId);
        // Ở đây bạn có thể thêm logic để hiển thị nội dung bài học
        console.log("Bài học được chọn:", lessonId);
    };

    const markAsCompleted = async (lessonId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài

        try {
            await api.post(`/client/api/user/progress/lesson/complete/${lessonId}`);
            // Cập nhật UI
            setLessons(lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
            ));
        } catch (error) {
            console.error("Lỗi khi đánh dấu hoàn thành:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-3 bg-red-50 rounded-lg text-center">{error}</div>;
    }

    return (
        <div className="p-5">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Danh sách bài học</h4>

            {lessons.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-gray-100 rounded-lg">
                    <p>Chưa có bài học nào trong module này.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedLesson === lesson.id
                                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                                    : 'bg-white border-gray-200 hover:shadow-sm'
                            }`}
                            onClick={() => handleLessonClick(lesson.id)}
                        >
                            <div className="flex items-start">
                                <div className={`rounded-full p-2 mr-4 mt-1 ${
                                    lesson.isCompleted
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {lesson.isCompleted ? <FiCheckCircle size={18} /> : <FiPlay size={18} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-medium text-gray-800">
                                                {lesson.orderIndex}. {lesson.name}
                                            </h5>
                                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 whitespace-nowrap ml-4">
                                            <FiClock className="mr-1" />
                                            <span>{lesson.duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-3">
                                        {lesson.isCompleted ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="mr-1" size={12} />
                        Đã hoàn thành
                      </span>
                                        ) : (
                                            <button
                                                onClick={(e) => markAsCompleted(lesson.id, e)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                            >
                                                Đánh dấu hoàn thành
                                            </button>
                                        )}

                                        {lesson.resourcesCount > 0 && (
                                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {lesson.resourcesCount} tài nguyên
                      </span>
                                        )}
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <FiArrowRight className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}