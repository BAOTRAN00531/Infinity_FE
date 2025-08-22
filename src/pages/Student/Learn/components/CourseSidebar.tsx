import { ModuleAccordion } from './ModuleAccordion';
import { Lesson, LearningModule} from 'types';

interface CourseSidebarProps {
    courseName: string;
    modules: LearningModule[]; // ✅ Dùng LearningModule
    selectedLesson: Lesson | null;
    onLessonSelect: (lesson: Lesson) => void;
    onModuleSelect: (moduleId: number) => void;
}

export const CourseSidebar = ({
                                  courseName,
                                  modules,
                                  selectedLesson,
                                  onLessonSelect,
                                  onModuleSelect
                              }: CourseSidebarProps) => {
    return (
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Nội dung khóa học</h3>
                <p className="text-sm text-gray-500 mt-1">{courseName}</p>
            </div>

            <div className="p-2">
                {modules && modules.length > 0 ? (
                    modules.map(module => (
                        <ModuleAccordion
                            key={module.id}
                            module={module}
                            selectedLesson={selectedLesson}
                            onLessonSelect={onLessonSelect}
                            onModuleSelect={onModuleSelect}
                        />
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        <p>Khóa học chưa có module nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};