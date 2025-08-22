export {}
// // src/pages/student/learn/[courseId].tsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect, useCallback } from 'react';
// import api from '@/api';
// import PageLayout from '@/components/layout-components/PageLayout';
// import { FiArrowLeft, FiBook, FiCheckCircle, FiClock, FiVideo, FiFileText, FiPlay, FiBarChart2 } from 'react-icons/fi';
// import { Progress } from '@/components/reusable-components/progress';
//
// interface Lesson {
//     id: number;
//     name: string;
//     type: string;
//     content: string;
//     videoUrl?: string;
//     duration: string;
//     isCompleted: boolean;
//     orderIndex: number;
// }
//
// interface Module {
//     id: number;
//     name: string;
//     description: string;
//     courseId: number;
//     courseName: string;
//     order: number;
//     duration: string | null;
//     status: string;
//     partsCount: number;
//     lessons?: Lesson[];
//     completedLessons?: number;
// }
//
// interface Course {
//     courseId: number;
//     courseName: string;
//     thumbnail: string;
//     modules: Module[];
// }
//
// interface CourseProgress {
//     courseId: number;
//     progressPercentage: number;
//     totalModules: number;
//     completedModules: number;
// }
//
// // ✅ Interface cho Question
// interface Question {
//     id: number;
//     questionText: string;
//     lessonId: number;
//     options: {
//         id: number;
//         optionText: string;
//         correct: boolean;
//         position: number;
//     }[];
// }
//
// // ✅ Component mới để hiển thị câu hỏi trắc nghiệm
// interface QuizProps {
//     questions: Question[];
// }
//
// const Quiz = ({ questions }: QuizProps) => {
//     // Logic quản lý câu trả lời, nộp bài, ... sẽ nằm ở đây
//     return (
//         <div className="bg-white rounded-lg shadow-md p-6 h-full">
//             <h2 className="text-2xl font-bold mb-4">Bài kiểm tra</h2>
//             {questions.map((q, index) => (
//                 <div key={q.id} className="mb-6 border-b border-gray-200 pb-4">
//                     <p className="font-semibold text-lg mb-2">Câu {index + 1}: {q.questionText}</p>
//                     {q.options.map(option => (
//                         <div key={option.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
//                             <input
//                                 type="radio"
//                                 name={`question-${q.id}`}
//                                 value={option.id}
//                                 className="form-radio text-blue-600"
//                             />
//                             <label className="text-gray-800">{option.optionText}</label>
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default function LearningPage() {
//     const { courseId } = useParams<{ courseId: string }>();
//     const navigate = useNavigate();
//     const [course, setCourse] = useState<Course | null>(null);
//     const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
//     const [isQuizMode, setIsQuizMode] = useState(false); // ✅ State để chuyển đổi chế độ
//     const [questions, setQuestions] = useState<Question[]>([]); // ✅ State để lưu câu hỏi
//
//     // Hàm fetch dữ liệu khóa học và tiến độ
//     const fetchCourseData = useCallback(async () => {
//         if (!courseId) return;
//
//         try {
//             setLoading(true);
//
//             // Lấy thông tin khóa học với modules
//             const courseResponse = await api.get(`/api/student/course/${courseId}`);
//             const courseData = courseResponse.data;
//             setCourse(courseData);
//
//             // Lấy thông tin tiến độ từ dashboard
//             const dashboardResponse = await api.get('/api/student/dashboard');
//             const dashboardData = dashboardResponse.data;
//
//             // Tìm tiến độ của khóa học hiện tại
//             const currentCourseProgress = dashboardData.find(
//                 (item: any) => item.courseId === parseInt(courseId)
//             );
//
//             if (currentCourseProgress) {
//                 setCourseProgress(currentCourseProgress);
//             }
//
//             // Load lessons cho module đầu tiên nếu có
//             if (courseData.modules && courseData.modules.length > 0) {
//                 const firstModule = courseData.modules[0];
//                 const lessonsResponse = await api.get(`/api/student/lesson/by-module/${firstModule.id}`);
//
//                 // ✅ Sửa lỗi ở đây: Thêm kiểu dữ liệu `Module` cho tham số `m`
//                 const updatedModules = courseData.modules.map((m: Module) =>
//                     m.id === firstModule.id
//                         ? { ...m, lessons: lessonsResponse.data }
//                         : m
//                 );
//
//                 setCourse({ ...courseData, modules: updatedModules });
//
//                 if (lessonsResponse.data.length > 0) {
//                     setSelectedLesson(lessonsResponse.data[0]);
//                 }
//             }
//         } catch (err) {
//             console.error("Lỗi tải thông tin khóa học:", err);
//             setError("Không thể tải thông tin khóa học.");
//         } finally {
//             setLoading(false);
//         }
//     }, [courseId]);
//
//     useEffect(() => {
//         fetchCourseData();
//     }, [fetchCourseData]);
//
//     const handleLessonSelect = (lesson: Lesson) => {
//         setSelectedLesson(lesson);
//     };
//
//     const handleModuleSelect = async (moduleId: number) => {
//         if (!course) return;
//
//         // Kiểm tra xem module đã có lessons chưa
//         const module = course.modules.find(m => m.id === moduleId);
//         if (!module || module.lessons) return;
//
//         try {
//             // Fetch lessons cho module
//             const response = await api.get(`/api/student/lesson/by-module/${moduleId}`);
//
//             // Cập nhật module với lessons
//             const updatedModules = course.modules.map(m =>
//                 m.id === moduleId ? { ...m, lessons: response.data } : m
//             );
//
//             setCourse({
//                 ...course,
//                 modules: updatedModules
//             });
//
//             // Chọn lesson đầu tiên nếu có
//             if (response.data.length > 0) {
//                 setSelectedLesson(response.data[0]);
//             }
//         } catch (err) {
//             console.error("Lỗi tải bài học:", err);
//         }
//     };
//
//     const markAsCompleted = async (lessonId: number) => {
//         try {
//             await api.post(`/client/api/user/progress/lesson/complete/${lessonId}`);
//             // Cập nhật UI ngay lập tức
//             if (selectedLesson && selectedLesson.id === lessonId) {
//                 setSelectedLesson({ ...selectedLesson, isCompleted: true });
//             }
//             // ... (các cập nhật state khác) ...
//         } catch (error) {
//             console.error("Lỗi khi đánh dấu hoàn thành:", error);
//             alert("Có lỗi xảy ra khi đánh dấu bài học hoàn thành. Vui lòng thử lại.");
//         }
//     };
//
//     // ✅ Hàm mới để vào chế độ làm bài kiểm tra
//     const startQuiz = async (lessonId: number) => {
//         try {
//             const response = await api.get(`/api/questions?lessonId=${lessonId}`);
//             setQuestions(response.data);
//             setIsQuizMode(true);
//         } catch (error) {
//             console.error("Lỗi khi tải câu hỏi:", error);
//             alert("Không thể tải bài kiểm tra. Vui lòng thử lại.");
//         }
//     };
//
//     if (loading) {
//         return (
//             <PageLayout>
//                 <div className="flex justify-center items-center min-h-screen">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             </PageLayout>
//         );
//     }
//
//     if (error) {
//         return (
//             <PageLayout>
//                 <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
//                     <div className="bg-red-50 p-6 rounded-lg max-w-md">
//                         <p className="text-red-500 text-lg mb-4">{error}</p>
//                         <button
//                             onClick={() => navigate('/student/dashboard')}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
//                         >
//                             <FiArrowLeft className="mr-2" />
//                             Quay lại Dashboard
//                         </button>
//                     </div>
//                 </div>
//             </PageLayout>
//         );
//     }
//
//     if (!course) {
//         return (
//             <PageLayout>
//                 <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
//                     <p className="text-gray-500 text-lg mb-4">Không tìm thấy khóa học</p>
//                     <button
//                         onClick={() => navigate('/student/dashboard')}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
//                     >
//                         <FiArrowLeft className="mr-2" />
//                         Quay lại Dashboard
//                     </button>
//                 </div>
//             </PageLayout>
//         );
//     }
//
//     return (
//         <PageLayout>
//             <div className="h-screen flex flex-col">
//                 {/* Header */}
//                 <div className="bg-white border-b border-gray-200 p-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <button
//                             onClick={() => navigate(`/student/course/${courseId}`)}
//                             className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//                         >
//                             <FiArrowLeft className="mr-2" />
//                             Quay lại khóa học
//                         </button>
//                         <h1 className="text-xl font-semibold text-gray-800">Đang học: {course.courseName}</h1>
//                         <div className="text-sm text-gray-600">
//                             {courseProgress ? (
//                                 <>
//                                     {courseProgress.completedModules}/{courseProgress.totalModules} modules hoàn thành
//                                 </>
//                             ) : (
//                                 'Đang tải tiến độ...'
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Thanh tiến độ */}
//                     {courseProgress && (
//                         <div className="flex items-center">
//                             <FiBarChart2 className="text-blue-500 mr-2" />
//                             <div className="flex-1 mr-2">
//                                 <Progress value={courseProgress.progressPercentage} className="h-2" />
//                             </div>
//                             <span className="text-sm font-medium text-blue-600">
//                 {typeof courseProgress.progressPercentage === 'number'
//                     ? courseProgress.progressPercentage.toFixed(1)
//                     : '0.0'}%
//               </span>
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Main content */}
//                 <div className="flex flex-1 overflow-hidden">
//                     {/* Lesson content - left side */}
//                     <div className="flex-1 bg-gray-100 p-6 overflow-auto">
//                         {isQuizMode ? ( // ✅ Điều kiện render Quiz hoặc Lesson
//                             <Quiz questions={questions} />
//                         ) : (
//                             selectedLesson ? (
//                                 <div className="bg-white rounded-lg shadow-md p-6 h-full">
//                                     <h2 className="text-2xl font-bold mb-4">{selectedLesson.name}</h2>
//                                     {selectedLesson.type === 'video' && selectedLesson.videoUrl ? (
//                                         <div className="aspect-video mb-6">
//                                             <iframe
//                                                 src={selectedLesson.videoUrl}
//                                                 className="w-full h-full rounded-lg"
//                                                 allowFullScreen
//                                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div className="prose max-w-none mb-6">
//                                             <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
//                                         </div>
//                                     )}
//                                     <div className="flex justify-between items-center mt-8">
//                                         <div className="flex items-center text-gray-600">
//                                             <FiClock className="mr-2" />
//                                             <span>{selectedLesson.duration}</span>
//                                         </div>
//                                         {/* ✅ Nút Đánh dấu hoàn thành */}
//                                         {!selectedLesson.isCompleted && (
//                                             <button
//                                                 onClick={() => markAsCompleted(selectedLesson.id)}
//                                                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
//                                             >
//                                                 <FiCheckCircle className="mr-2" />
//                                                 Đánh dấu đã hoàn thành
//                                             </button>
//                                         )}
//                                         {/* ✅ Nút làm bài kiểm tra sau khi hoàn thành */}
//                                         {selectedLesson.isCompleted && (
//                                             <button
//                                                 onClick={() => startQuiz(selectedLesson.id)}
//                                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//                                             >
//                                                 <FiFileText className="mr-2" />
//                                                 Làm bài kiểm tra
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center h-full text-center">
//                                     <FiPlay className="text-4xl text-gray-400 mb-4" />
//                                     <p className="text-gray-500 text-lg">Chọn một bài học để bắt đầu</p>
//                                     <p className="text-gray-400 text-sm mt-2">Nhấn vào bài học trong danh sách bên phải</p>
//                                 </div>
//                             )
//                         )}
//                     </div>
//
//                     {/* Modules and lessons - right side */}
//                     <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
//                         <div className="p-4 border-b border-gray-200">
//                             <h3 className="font-semibold text-lg">Nội dung khóa học</h3>
//                             <p className="text-sm text-gray-500 mt-1">{course.courseName}</p>
//                         </div>
//
//                         <div className="p-2">
//                             {course.modules && course.modules.length > 0 ? (
//                                 course.modules.map(module => (
//                                     <ModuleAccordion
//                                         key={module.id}
//                                         module={module}
//                                         selectedLesson={selectedLesson}
//                                         onLessonSelect={handleLessonSelect}
//                                         onModuleSelect={handleModuleSelect}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="p-4 text-center text-gray-500">
//                                     <p>Khóa học chưa có module nào</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </PageLayout>
//     );
// }
//
// // Component con cho module accordion
// interface ModuleAccordionProps {
//     module: Module;
//     selectedLesson: Lesson | null;
//     onLessonSelect: (lesson: Lesson) => void;
//     onModuleSelect: (moduleId: number) => void;
// }
//
// function ModuleAccordion({ module, selectedLesson, onLessonSelect, onModuleSelect }: ModuleAccordionProps) {
//     const [isExpanded, setIsExpanded] = useState(false);
//
//     const toggleExpand = () => {
//         setIsExpanded(!isExpanded);
//         if (!isExpanded && !module.lessons) {
//             onModuleSelect(module.id);
//         }
//     };
//
//     // Tính số bài học đã hoàn thành trong module
//     const completedInModule = module.lessons
//         ? module.lessons.filter(lesson => lesson.isCompleted).length
//         : 0;
//
//     return (
//         <div className="mb-2 border rounded-lg overflow-hidden">
//             <div
//                 className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
//                 onClick={toggleExpand}
//             >
//                 <div className="flex items-center">
//                     <FiBook className="text-blue-500 mr-2" />
//                     <div>
//                         <span className="font-medium">Module {module.order}: {module.name}</span>
//                         <div className="text-xs text-gray-500 mt-1">
//                             {completedInModule}/{module.lessons?.length || 0} bài hoàn thành
//                         </div>
//                     </div>
//                 </div>
//                 <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
//           ▼
//         </span>
//             </div>
//
//             {isExpanded && (
//                 <div className="bg-white">
//                     {module.lessons && module.lessons.length > 0 ? (
//                         module.lessons.map(lesson => (
//                             <div
//                                 key={lesson.id}
//                                 className={`p-3 border-t border-gray-100 cursor-pointer flex items-center transition-colors ${
//                                     selectedLesson?.id === lesson.id
//                                         ? 'bg-blue-50 text-blue-700'
//                                         : 'hover:bg-gray-50'
//                                 }`}
//                                 onClick={() => onLessonSelect(lesson)}
//                             >
//                                 {lesson.type === 'video' ? (
//                                     <FiVideo className="mr-2 text-red-500" />
//                                 ) : (
//                                     <FiFileText className="mr-2 text-green-500" />
//                                 )}
//
//                                 <span className="flex-1">
//                   {lesson.orderIndex}. {lesson.name}
//                                     {lesson.isCompleted && (
//                                         <FiCheckCircle className="inline-block ml-2 text-green-500" size={14} />
//                                     )}
//                 </span>
//
//                                 <span className="text-xs text-gray-500">{lesson.duration}</span>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="p-3 text-center text-gray-500">
//                             <p>Đang tải bài học...</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }