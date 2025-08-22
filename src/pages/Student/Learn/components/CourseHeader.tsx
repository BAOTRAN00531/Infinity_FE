import { FiArrowLeft, FiBarChart2 } from 'react-icons/fi';
import { Progress } from '@/components/reusable-components/progress';

interface CourseProgress {
    courseId: number;
    progressPercentage: number;
    totalModules: number;
    completedModules: number;
}

interface CourseHeaderProps {
    courseName: string;
    courseProgress: CourseProgress | null;
    onBack: () => void;
}

export const CourseHeader = ({ courseName, courseProgress, onBack }: CourseHeaderProps) => {
    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <FiArrowLeft className="mr-2" />
                    Quay lại khóa học
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Đang học: {courseName}</h1>
                <div className="text-sm text-gray-600">
                    {courseProgress ? (
                        <>
                            {courseProgress.completedModules}/{courseProgress.totalModules} modules hoàn thành
                        </>
                    ) : (
                        'Đang tải tiến độ...'
                    )}
                </div>
            </div>

            {/* Thanh tiến độ */}
            {courseProgress && (
                <div className="flex items-center">
                    <FiBarChart2 className="text-blue-500 mr-2" />
                    <div className="flex-1 mr-2">
                        <Progress value={courseProgress.progressPercentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-blue-600">
            {typeof courseProgress.progressPercentage === 'number'
                ? courseProgress.progressPercentage.toFixed(1)
                : '0.0'}%
          </span>
                </div>
            )}
        </div>
    );
};