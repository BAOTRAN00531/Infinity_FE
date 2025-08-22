import { useState } from 'react';
import { FiBook, FiVideo, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { Lesson, LearningModule} from 'types';

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

    // ✅ Thêm type cho lesson parameter
    const completedInModule = module.lessons
        ? module.lessons.filter((lesson: Lesson) => lesson.isCompleted).length
        : 0;

    return (
        <div className="mb-2 border rounded-lg overflow-hidden">
            <div
                className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={toggleExpand}
            >
                <div className="flex items-center">
                    <FiBook className="text-blue-500 mr-2" />
                    <div>
                        <span className="font-medium">
                            Module {module.order}: {module.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                            {completedInModule}/{module.lessons?.length || 0} bài hoàn thành
                        </div>
                    </div>
                </div>
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </div>

            {isExpanded && (
                <div className="bg-white">
                    {module.lessons && module.lessons.length > 0 ? (
                        // ✅ Thêm type cho lesson parameter
                        module.lessons.map((lesson: Lesson) => (
                            <div
                                key={lesson.id}
                                className={`p-3 border-t border-gray-100 cursor-pointer flex items-center transition-colors ${
                                    selectedLesson?.id === lesson.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'hover:bg-gray-50'
                                }`}
                                onClick={() => onLessonSelect(lesson)}
                            >
                                {lesson.type === 'video' ? (
                                    <FiVideo className="mr-2 text-red-500" />
                                ) : (
                                    <FiFileText className="mr-2 text-green-500" />
                                )}

                                <span className="flex-1">
                                    {lesson.orderIndex}. {lesson.name}
                                    {lesson.isCompleted && (
                                        <FiCheckCircle className="inline-block ml-2 text-green-500" size={14} />
                                    )}
                                </span>

                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            <p>Đang tải bài học...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};