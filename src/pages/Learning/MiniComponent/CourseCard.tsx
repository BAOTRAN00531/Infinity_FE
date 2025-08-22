import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/reusable-components/badge';
import { Button } from '@/components/reusable-components/button';
import { BookOpen } from 'lucide-react';
import { Tooltip } from '@/components/reusable-components/tooltip';

interface CourseCardProps {
    course: {
        id: number;
        name: string;
        description: string;
        price: number;
        status: string;
        level: 'Beginner' | 'Intermediate' | 'Advanced';
        thumbnail?: string; // optional image
        progress?: number; // optional progress, 0-100
    };
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigate = useNavigate();
    const isActive = course.status.toLowerCase() === 'active';
    const progress = course.progress ?? Math.floor(Math.random() * 70 + 20); // mock

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col overflow-hidden"
        >
            {/* Thumbnail */}
            <div className="h-32 bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Không có ảnh</span>
                )}
            </div>
            {/* Nội dung */}
            <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                <div>
                    <h2 className="text-lg font-semibold line-clamp-2">{course.name}</h2>
                    <p
                        className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3"
                        title={course.description}
                    >
                        {course.description}
                    </p>
                </div>

                {/* Level */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Trình độ:</span>
                    <Badge
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            course.level === 'Beginner'
                                ? 'bg-green-100 text-green-800'
                                : course.level === 'Intermediate'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {course.level}
                    </Badge>
                </div>

                {/* Progress */}
                <div className="mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Tiến độ học:</span>
                    <div className="w-full h-2 bg-gray-300 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Giá + Trạng thái */}
                <div className="flex justify-between items-center mt-auto">
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Giá</span>
                        <span className="text-base font-bold text-blue-600 dark:text-teal-400">
              {course.price > 0
                  ? `${course.price.toLocaleString()}₫`
                  : 'Miễn phí'}
            </span>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Trạng thái</span>
                        <Badge
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                isActive
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        >
                            {isActive ? 'Đang mở' : 'Đã đóng'}
                        </Badge>
                    </div>
                </div>

                {/* Nút chi tiết */}
                <Button
                    onClick={() => navigate(`/client/detail/${course.id}`)} // ✅ Cập nhật đường dẫn
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                    <BookOpen className="w-4 h-4" />
                    Xem chi tiết
                </Button>
            </div>
        </motion.div>
    );
};
