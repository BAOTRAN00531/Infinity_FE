// ModuleAccordion.tsx - Updated với màu sắc đậm và tích xanh
import { useState } from 'react';
import { FiBook, FiVideo, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { Lesson, LearningModule } from 'types';

interface ModuleAccordionProps {
    module: LearningModule;
    selectedLesson: Lesson | null;
    onLessonSelect: (lesson: Lesson) => void;
    onModuleSelect: (moduleId: number) => void;
}

export const ModuleAccordion = ({
                                    module,
                                    selectedLesson,
                                    onLessonSelect,
                                    onModuleSelect
                                }: ModuleAccordionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded && !module.lessons) {
            onModuleSelect(module.id);
        }
    };

    const completedInModule = module.lessons
        ? module.lessons.filter((lesson: Lesson) => lesson.isCompleted).length
        : 0;

    // ✅ Hàm xác định màu nền dựa trên trạng thái
    const getLessonBgColor = (lesson: Lesson) => {
        if (selectedLesson?.id === lesson.id) {
            return 'bg-blue-100 border-l-4 border-blue-500'; // Bài đang chọn
        }
        if (lesson.isCompleted) {
            return 'bg-green-50 border-l-4 border-green-500'; // Đã hoàn thành
        }
        return 'bg-white border-l-4 border-gray-200'; // Chưa học
    };

    return (
        <div className="mb-3 border rounded-lg overflow-hidden shadow-sm">
            <div
                className="p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center cursor-pointer transition-colors"
                onClick={toggleExpand}
            >
                <div className="flex items-center">
                    <FiBook className="text-blue-600 mr-3" size={18} />
                    <div>
                        <span className="font-semibold text-gray-800">
                            Module {module.order}: {module.name}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                            {completedInModule}/{module.lessons?.length || 0} bài hoàn thành
                        </div>
                    </div>
                </div>
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-600`}>
                    ▼
                </span>
            </div>

            {isExpanded && (
                <div className="bg-white">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: Lesson) => (
                            <div
                                key={lesson.id}
                                className={`p-4 border-t border-gray-100 cursor-pointer flex items-center transition-all duration-200 ${getLessonBgColor(lesson)} ${
                                    lesson.isCompleted ? 'font-medium' : ''
                                }`}
                                onClick={() => onLessonSelect(lesson)}
                            >
                                {/* ✅ Thêm logic để hiển thị icon khác nhau */}
                                {lesson.type === 'video' ? (
                                    <FiVideo className="mr-3 text-red-600 flex-shrink-0" size={16} />
                                ) : lesson.type === 'document' ? (
                                    <FiFileText className="mr-3 text-green-600 flex-shrink-0" size={16} />
                                ) : (
                                    // Icon mới cho bài học có quiz
                                    <FiFileText className="mr-3 text-blue-600 flex-shrink-0" size={16} />
                                )}
                                {/* Nội dung bài học */}
                                <span className="flex-1 text-gray-800">
                                    {lesson.orderIndex}. {lesson.name}
                                    {lesson.isCompleted && (
                                        <FiCheckCircle className="inline-block ml-2 text-green-600" size={16} />
                                    )}
                                </span>

                                {/* Thời lượng */}
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {lesson.duration}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 bg-gray-50">
                            <p>Đang tải bài học...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};