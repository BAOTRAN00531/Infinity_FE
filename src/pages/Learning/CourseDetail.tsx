// CourseDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/layout-components/Header";

interface CourseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    level: string;
    duration: string;
    status: string;
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<CourseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios
                .get(`/client/api/course/${id}`)
                .then((res) => setCourse(res.data))
                .catch(() => setError("Không thể tải thông tin khóa học."))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!course) return <div className="p-4 text-gray-600">Không tìm thấy khóa học.</div>;

    const handleBuy = () => {
        navigate(`/purchase?courseId=${course.id}`);
    };

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto mt-8 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400"
                >
                    {course.name}
                </motion.h1>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
                    <div><strong>Giá:</strong> {course.price.toLocaleString()} VNĐ</div>
                    <div><strong>Thời lượng:</strong> {course.duration}</div>
                    <div><strong>Cấp độ:</strong> {course.level}</div>
                    <div><strong>Trạng thái:</strong> {course.status}</div>
                </div>

                <button
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow transition"
                    onClick={handleBuy}
                >
                    Mua khóa học
                </button>
            </div>
        </>
    );
}
