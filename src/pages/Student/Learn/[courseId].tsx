import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import api from '@/api';
import PageLayout from '@/components/layout-components/PageLayout';
import {
    CourseHeader,
    LessonContentArea,
    CourseSidebar
} from './components';
import { LearningCourse, CourseProgress, Lesson, LearningModule, StudentQuestion  } from 'types';

// Interface cho kết quả quiz
interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    results: Record<number, boolean>;
}

export default function LearningPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<LearningCourse | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [questions, setQuestions] = useState<StudentQuestion[]>([]);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

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
        setIsQuizMode(false);
        setQuizResult(null);
    };

    const handleModuleSelect = async (moduleId: number) => {
        if (!course) return;

        const module = course.modules.find((m: LearningModule) => m.id === moduleId);
        if (!module || module.lessons) return;

        try {
            const response = await api.get(`/api/student/lesson/by-module/${moduleId}`);

            const updatedModules = course.modules.map((m: LearningModule) =>
                m.id === moduleId ? { ...m, lessons: response.data } : m
            );

            setCourse({
                ...course,
                modules: updatedModules
            });

            if (response.data.length > 0) {
                setSelectedLesson(response.data[0]);
                setIsQuizMode(false);
                setQuizResult(null);
            }
        } catch (err) {
            console.error("Lỗi tải bài học:", err);
        }
    };

    const markAsCompleted = async (lessonId: number) => {
        try {
            await api.post(`/client/api/user/progress/lesson/complete/${lessonId}`);

            // Chỉ cập nhật trạng thái của bài học hiện tại trong state `selectedLesson`
            if (selectedLesson && selectedLesson.id === lessonId) {
                setSelectedLesson({ ...selectedLesson, isCompleted: true });
            }

            // Cập nhật trạng thái `isCompleted` của bài học trong mảng `modules` để Sidebar được cập nhật
            if (course) {
                const updatedModules = course.modules.map((m: any) => ({
                    ...m,
                    lessons: m.lessons?.map((l: any) =>
                        l.id === lessonId ? { ...l, isCompleted: true } : l
                    ),
                }));
                setCourse({ ...course, modules: updatedModules });
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu hoàn thành:", error);
            alert("Có lỗi xảy ra khi đánh dấu bài học hoàn thành. Vui lòng thử lại.");
        }
    };

    const startQuiz = async (lessonId: number) => {
        try {
            // Sửa thành API student để ẩn đáp án
            const response = await api.get(`/api/student/quiz/lesson/${lessonId}/questions`);
            setQuestions(response.data);
            setIsQuizMode(true);
            setQuizResult(null);
        } catch (error) {
            console.error("Lỗi khi tải câu hỏi:", error);
            alert("Không thể tải bài kiểm tra. Vui lòng thử lại.");
        }
    };

    const handleQuizSubmit = async (answers: Record<number, number>) => {
        if (!selectedLesson) return;

        try {
            const response = await api.post(`/api/student/quiz/lesson/${selectedLesson.id}/submit`, {
                answers: answers
            });
            setQuizResult(response.data);

            // Tự động đánh dấu bài học là đã hoàn thành nếu đạt điểm
            if (response.data.score >= 70) { // 70% trở lên
                await markAsCompleted(selectedLesson.id);
            }
        } catch (error) {
            console.error("Lỗi khi nộp bài:", error);
            alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
        }
    };

    const handleQuizComplete = () => {
        setIsQuizMode(false);
        setQuizResult(null);
        // Refresh course data để cập nhật tiến độ
        fetchCourseData();
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
                    courseName={course.courseName}
                    courseProgress={courseProgress}
                    onBack={handleBackToCourse}
                />

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
                        <LessonContentArea
                            selectedLesson={selectedLesson}
                            isQuizMode={isQuizMode}
                            questions={questions}
                            quizResult={quizResult}
                            onMarkComplete={markAsCompleted}
                            onStartQuiz={startQuiz}
                            onQuizSubmit={handleQuizSubmit}
                            onQuizComplete={handleQuizComplete}
                        />
                    </div>

                    <CourseSidebar
                        courseName={course.courseName}
                        modules={course.modules}
                        selectedLesson={selectedLesson}
                        onLessonSelect={handleLessonSelect}
                        onModuleSelect={handleModuleSelect}
                    />
                </div>
            </div>
        </PageLayout>
    );
}