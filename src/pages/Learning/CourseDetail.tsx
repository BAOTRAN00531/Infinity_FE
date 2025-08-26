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
    const [progress, setProgress] = useState<number>(0);
    const [userRole, setUserRole] = useState<string | null>(null);
    const token = localStorage.getItem("access_token");
    let userName = "Ẩn danh";

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userName = payload.sub || "Ẩn danh";
                setUserRole(payload.role);
            } catch (e) {
                console.error("Token không hợp lệ:", e);
            }
        }
    }, [token]);

    useEffect(() => {
        if (id) {
            setLoading(true);

            const courseApiCall = api.get(`/client/api/course/${id}`);

            if (userRole === "ROLE_STUDENT") {
                const progressApiCall = api.get(`/client/api/user/progress/course/${id}`);

                Promise.all([courseApiCall, progressApiCall])
                    .then(([courseRes, progressRes]) => {
                        setCourse(courseRes.data);
                        setProgress(progressRes.data);
                    })
                    .catch(() => setError("Không thể tải thông tin khóa học hoặc tiến độ."))
                    .finally(() => setLoading(false));
            } else {
                courseApiCall
                    .then((courseRes) => {
                        setCourse(courseRes.data);
                    })
                    .catch(() => setError("Không thể tải thông tin khóa học."))
                    .finally(() => setLoading(false));
            }
        }
    }, [id, userRole]);

    const handleBuy = () => {
        navigate(`/purchase?courseId=${course?.id}`);
    };

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!course) return <div className="p-4 text-gray-600">Không tìm thấy khóa học.</div>;

    const courseThumbnailUrl = course.thumbnail.startsWith("http")
        ? course.thumbnail
        : `http://localhost:8080${course.thumbnail}`;

    return (
        <PageLayout>
            {/* Banner */}
            <div className="w-full h-80 relative">
                <img
                    src={courseThumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-extrabold text-white text-center px-6 pb-10 drop-shadow-lg"
                    >
                        {course.name}
                    </motion.h1>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-5xl mx-auto -mt-24 z-10 relative">
                <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
                    {/* Mô tả */}
                    <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                        {course.description}
                    </p>

                    {/* Thông tin khóa học */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow hover:scale-105 transition">
                            <span className="block text-2xl">💵</span>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Giá</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.price?.toLocaleString() ?? "Chưa có giá"}₫
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-700 shadow hover:scale-105 transition">
                            <span className="block text-2xl">⏱</span>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Thời lượng</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.duration}
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-gray-800 dark:to-gray-700 shadow hover:scale-105 transition">
                            <span className="block text-2xl">📘</span>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Cấp độ</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.level}
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 dark:from-gray-800 dark:to-gray-700 shadow hover:scale-105 transition">
                            <span className="block text-2xl">📌</span>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Trạng thái</p>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {course.status}
                            </h4>
                        </div>
                    </div>

                    {/* Tiến độ học tập */}
                    {userRole === "ROLE_STUDENT" && (
                        <div className="mb-8">
                            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                📊 Tiến độ học tập
                            </h3>
                            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
                            <span className="text-xs mt-1 block text-gray-500 dark:text-gray-400">
                                {progress.toFixed(2)}% hoàn thành
                            </span>
                        </div>
                    )}

                    {/* Nút mua */}
                    <button
                        onClick={handleBuy}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
                    >
                        🚀 Mua khóa học ngay
                    </button>
                </div>

                {/* Tabs */}
                <Tab.Group>
                    <Tab.List className="flex space-x-4 mt-10 mb-6">
                        {["Giới thiệu", "Nội dung", "Mục tiêu"].map((title) => (
                            <Tab
                                key={title}
                                className={({ selected }) =>
                                    `px-5 py-2 text-sm font-medium rounded-xl transition ${
                                        selected
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`
                                }
                            >
                                {title}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
                        <Tab.Panel>
                            <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
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

                {/* Bình luận */}
                {course?.id && (
                    <div className="mt-10 mb-16">   {/* 👈 thêm mb-16 để nới ra */}
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
