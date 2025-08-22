import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api";
import { Progress } from "@/components/reusable-components/progress";
import { Tab } from "@headlessui/react";
import { CommentFirebase } from "@/components/comments/CommentFirebase";
import PageLayout from "@/components/layout-components/PageLayout";

interface CourseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    level: string;
    duration: string;
    status: string;
    thumbnail: string;
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<CourseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const userAvatarUrl = localStorage.getItem("avatar") || undefined;

    const token = localStorage.getItem("access_token");
    let userName = "Ẩn danh";

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userName = payload.sub || "Ẩn danh";
        } catch (e) {
            console.error("Token không hợp lệ:", e);
        }
    }

    useEffect(() => {
        if (id) {
            api
                .get(`/client/api/course/${id}`, { skipAuthRedirect: true })
                .then((res) => setCourse(res.data))
                .catch(() => setError("Không thể tải thông tin khóa học."))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleBuy = () => {
        navigate(`/purchase?courseId=${course?.id}`);
    };

    if (loading) return <div className="p-4 text-center">⏳ Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!course)
        return <div className="p-4 text-gray-600">Không tìm thấy khóa học.</div>;

    const courseThumbnailUrl = course.thumbnail.startsWith("http")
        ? course.thumbnail
        : `http://localhost:8080${course.thumbnail}`;

    return (
        <PageLayout>
            {/* Banner */}
            <div className="w-full h-80 relative rounded-b-3xl overflow-hidden shadow-lg">
                <img
                    src={courseThumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover"
                />
                {/*<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center">*/}
                {/*    <motion.h1*/}
                {/*        initial={{ opacity: 0, y: 20 }}*/}
                {/*        animate={{ opacity: 1, y: 0 }}*/}
                {/*        className="text-4xl font-extrabold text-white text-center px-6 pb-10 drop-shadow-lg"*/}
                {/*    >*/}
                {/*        {course.name}*/}
                {/*    </motion.h1>*/}
                {/*</div>*/}
            </div>

            {/* Nội dung chi tiết */}
            <div className="max-w-5xl mx-auto -mt-16 relative z-10">
                <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                        {course.description}
                    </p>

                    {/* Thông tin chi tiết */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center">
                            <p className="text-sm text-gray-500">💵 Giá</p>
                            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                {course.price?.toLocaleString() ?? "Chưa có giá"}₫
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center">
                            <p className="text-sm text-gray-500">⏱ Thời lượng</p>
                            <p className="font-bold">{course.duration}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center">
                            <p className="text-sm text-gray-500">📘 Cấp độ</p>
                            <p className="font-bold">{course.level}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center">
                            <p className="text-sm text-gray-500">📌 Trạng thái</p>
                            <p className="font-bold">{course.status}</p>
                        </div>
                    </div>

                    {/* Tiến độ */}
                    <div className="mb-8">
                        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            Tiến độ học tập
                        </h3>
                        <Progress
                            value={42}
                            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full"
                        />
                        <span className="text-xs mt-1 block text-gray-500 dark:text-gray-400">
              42% hoàn thành
            </span>
                    </div>

                    {/* Nút mua */}
                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBuy}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-8 rounded-2xl shadow-lg text-lg font-semibold transition"
                        >
                            🚀 Mua khóa học
                        </motion.button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-10">
                    <Tab.Group>
                        <Tab.List className="flex space-x-3 mb-6 justify-center">
                            {["Giới thiệu", "Nội dung", "Mục tiêu"].map((title) => (
                                <Tab
                                    key={title}
                                    className={({ selected }) =>
                                        `px-5 py-2.5 text-sm font-medium rounded-full transition ${
                                            selected
                                                ? "bg-blue-600 text-white shadow"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }`
                                    }
                                >
                                    {title}
                                </Tab>
                            ))}
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {course.description}
                                </p>
                            </Tab.Panel>
                            <Tab.Panel>
                                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
                                    <li>Module 1: Tổng quan</li>
                                    <li>Module 2: Cài đặt & cấu hình</li>
                                    <li>Module 3: Dự án thực tế</li>
                                    <li>Module 4: Ôn tập và kiểm tra</li>
                                </ul>
                            </Tab.Panel>
                            <Tab.Panel>
                                <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
                                    <li>Nắm vững kiến thức nền tảng</li>
                                    <li>Có thể làm mini project</li>
                                    <li>Chuẩn bị tốt cho phỏng vấn</li>
                                </ul>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                {/* Comment box */}
                {course?.id && (
                    <div className="mt-10 pb-20">   {/* thêm khoảng trống ở dưới */}
                        <CommentFirebase
                            courseId={course.id.toString()}
                            userName={userName}
                            userAvatarUrl={userAvatarUrl}
                        />
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
