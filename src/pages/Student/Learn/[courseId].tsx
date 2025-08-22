// src/pages/student/learn/[courseId].tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '@/api';
import PageLayout from '@/components/layout-components/PageLayout';
import {
    CourseHeader,
    LessonContentArea,
    CourseSidebar
} from './components';
import { LearningCourse, CourseProgress, Lesson, LearningModule, Question } from 'types'; // ✅ Sửa import

export default function LearningPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<LearningCourse | null>(null); // ✅ Đổi thành LearningCourse
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchCourseData = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            const courseResponse = await api.get(`/api/student/course/${courseId}`);
            const courseData = courseResponse.data;
            setCourse(courseData);

            const dashboardResponse = await api.get('/api/student/dashboard');
            const dashboardData = dashboardResponse.data;

            const currentCourseProgress = dashboardData.find(
                (item: any) => item.courseId === parseInt(courseId)
            );

            if (currentCourseProgress) {
                setCourseProgress(currentCourseProgress);
            }

            if (courseData.modules && courseData.modules.length > 0) {
                const firstModule = courseData.modules[0];
                const lessonsResponse = await api.get(`/api/student/lesson/by-module/${firstModule.id}`);

                // ✅ Sửa type cho parameter m
                const updatedModules = courseData.modules.map((m: LearningModule) =>
                    m.id === firstModule.id
                        ? { ...m, lessons: lessonsResponse.data }
                        : m
                );

                setCourse({ ...courseData, modules: updatedModules });

                if (lessonsResponse.data.length > 0) {
                    setSelectedLesson(lessonsResponse.data[0]);
                }
            }
        } catch (err) {
            console.error("Lỗi tải thông tin khóa học:", err);
            setError("Không thể tải thông tin khóa học.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleLessonSelect = (lesson: Lesson) => {
        setSelectedLesson(lesson);
    };

    const handleModuleSelect = async (moduleId: number) => {
        if (!course) return;

        // ✅ Thêm type cho parameter m
        const module = course.modules.find((m: LearningModule) => m.id === moduleId);
        if (!module || module.lessons) return;

        try {
            const response = await api.get(`/api/student/lesson/by-module/${moduleId}`);

            // ✅ Thêm type cho parameter m
            const updatedModules = course.modules.map((m: LearningModule) =>
                m.id === moduleId ? { ...m, lessons: response.data } : m
            );

            setCourse({
                ...course,
                modules: updatedModules
            });

            if (response.data.length > 0) {
                setSelectedLesson(response.data[0]);
            }
        } catch (err) {
            console.error("Lỗi tải bài học:", err);
        }
    };

    const markAsCompleted = async (lessonId: number) => {
        try {
            await api.post(`/client/api/user/progress/lesson/complete/${lessonId}`);
            if (selectedLesson && selectedLesson.id === lessonId) {
                setSelectedLesson({ ...selectedLesson, isCompleted: true });
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu hoàn thành:", error);
            alert("Có lỗi xảy ra khi đánh dấu bài học hoàn thành. Vui lòng thử lại.");
        }
    };

    const startQuiz = async (lessonId: number) => {
        try {
            const response = await api.get(`/api/questions?lessonId=${lessonId}`);
            setQuestions(response.data);
            setIsQuizMode(true);
        } catch (error) {
            console.error("Lỗi khi tải câu hỏi:", error);
            alert("Không thể tải bài kiểm tra. Vui lòng thử lại.");
        }
    };

    const handleBackToCourse = () => {
        navigate(`/student/course/${courseId}`);
    };

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
                            Quay lại Dashboard
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!course) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    <p className="text-gray-500 text-lg mb-4">Không tìm thấy khóa học</p>
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="h-screen flex flex-col">
                <CourseHeader
                    courseName={course.courseName} // ✅ Giờ đúng vì LearningCourse có courseName
                    courseProgress={courseProgress}
                    onBack={handleBackToCourse}
                />

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
                        <LessonContentArea
                            selectedLesson={selectedLesson}
                            isQuizMode={isQuizMode}
                            questions={questions}
                            onMarkComplete={markAsCompleted}
                            onStartQuiz={startQuiz}
                        />
                    </div>

                    <CourseSidebar
                        courseName={course.courseName} // ✅ Giờ đúng
                        modules={course.modules} // ✅ Giờ đúng vì LearningCourse có modules
                        selectedLesson={selectedLesson}
                        onLessonSelect={handleLessonSelect}
                        onModuleSelect={handleModuleSelect}
                    />
                </div>
            </div>
        </PageLayout>
    );
}