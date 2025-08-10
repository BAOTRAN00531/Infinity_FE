import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api"; // dùng instance đã cấu hình
import Header from "@/components/layout-components/Header";
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

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!course) return <div className="p-4 text-gray-600">Không tìm thấy khóa học.</div>;

    return (
        <PageLayout>
            <div className="w-full h-72 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center px-4"
                >
                    {course.name}
                </motion.h1>
            </div>

            <div className="max-w-4xl mx-auto -mt-20 z-10 relative">
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200 mb-6">
                        <div><strong>💵 Giá:</strong> {course.price?.toLocaleString() ?? 'Chưa có giá'}₫</div>
                        <div><strong>⏱ Thời lượng:</strong> {course.duration}</div>
                        <div><strong>📘 Cấp độ:</strong> {course.level}</div>
                        <div><strong>📌 Trạng thái:</strong> {course.status}</div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Tiến độ học tập</h3>
                        <Progress value={42} className="h-3 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs mt-1 block text-gray-500 dark:text-gray-400">42% hoàn thành</span>
                    </div>

                    <button
                        onClick={handleBuy}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow transition"
                    >
                        🚀 Mua khóa học
                    </button>
                </div>

                <Tab.Group>
                    <Tab.List className="flex space-x-4 mb-6">
                        {["Giới thiệu", "Nội dung", "Mục tiêu"].map((title) => (
                            <Tab
                                key={title}
                                className={({ selected }) =>
                                    `px-4 py-2 text-sm font-medium rounded-lg ${
                                        selected
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                    }`
                                }
                            >
                                {title}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels>
                        <Tab.Panel>
                            <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
                        </Tab.Panel>
                        <Tab.Panel>
                            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                                <li>Module 1: Tổng quan</li>
                                <li>Module 2: Cài đặt & cấu hình</li>
                                <li>Module 3: Dự án thực tế</li>
                                <li>Module 4: Ôn tập và kiểm tra</li>
                            </ul>
                        </Tab.Panel>
                        <Tab.Panel>
                            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                                <li>Nắm vững kiến thức nền tảng</li>
                                <li>Có thể làm mini project</li>
                                <li>Chuẩn bị tốt cho phỏng vấn</li>
                            </ul>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                {course?.id && (
                    <CommentFirebase
                        courseId={course.id.toString()}
                        userName={userName}
                        userAvatarUrl={userAvatarUrl}
                    />
                )}
            </div>
        </PageLayout>
    );
}
