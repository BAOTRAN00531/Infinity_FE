// components/MiniComponent/CourseCard.tsx
import { motion } from 'framer-motion';

import { Button } from '@/components/reusable-components/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";




interface CourseCardProps {
    course: {
        id: number;
        name: string;
        description: string;
        price: number;
        status: string;
    };
}





export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:shadow-xl"
        >
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.name}</h2>
                <p className="text-sm text-gray-300 line-clamp-3">{course.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <p className="text-lg font-semibold text-teal-400">
                    {course.price > 0 ? `$${course.price}` : 'Miễn phí'}
                </p>

                <Button
                    onClick={() => navigate(`/client/course/${course.id}`)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white transition rounded-xl shadow"
                >
                    Xem chi tiết
                </Button>
            </div>
        </motion.div>
    );
};