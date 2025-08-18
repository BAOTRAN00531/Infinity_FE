import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom'; // ✅ Thêm useParams
import { motion } from 'framer-motion';
import api from "@/api";

interface Course {
    id: number;
    name: string;
    language: string;
}

// ✅ Cập nhật breadcrumbNameMap để hỗ trợ các đường dẫn mới
const breadcrumbNameMap: Record<string, string> = {
    '': 'Trang chủ',
    'client': 'Khóa học',
    'course': 'Danh sách',
    'login': 'Đăng nhập',
    'register': 'Đăng ký',
    'languages': 'Ngôn ngữ',
    'create': 'Tạo mới',
    'student': 'Của tôi' // ✅ Thêm đường dẫn cho sinh viên
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const [courseTitle, setCourseTitle] = useState<string | null>(null);

    const pathnames = location.pathname.split('/').filter(Boolean);

    // ✅ Logic để lấy tên ngôn ngữ và id khóa học
    const languageNameInPath = pathnames[2];
    const courseIdInPath = pathnames[3];

    // ✅ useEffect mới để lấy tên khóa học
    useEffect(() => {
        const fetchCourseTitle = async () => {
            if (pathnames[0] === 'client' && pathnames[1] === 'course' && courseIdInPath) {
                try {
                    // ✅ Gửi yêu cầu với ID khóa học
                    const { data } = await api.get<Course>(`client/api/course/${courseIdInPath}`);
                    setCourseTitle(data.name);
                } catch (err) {
                    console.error('Lỗi khi lấy course:', err);
                    setCourseTitle(null);
                }
            } else {
                setCourseTitle(null);
            }
        };

        fetchCourseTitle();
    }, [courseIdInPath, location.pathname, pathnames]);

    return (
        <motion.nav
            className="bg-gray-50 dark:bg-gray-800 w-full py-3 px-4"
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                <ol className="flex flex-wrap items-center text-sm text-gray-700 dark:text-gray-300 space-x-1 sm:space-x-3">
                    <li>
                        <Link to="/" className="flex items-center text-blue-600 hover:underline font-medium">
                            <svg
                                className="w-4 h-4 mr-1 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 3.293l6 6V17a1 1 0 01-1 1h-3v-4H8v4H5a1 1 0 01-1-1v-7.707l6-6z" />
                            </svg>
                            Trang chủ
                        </Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const isLast = index === pathnames.length - 1;
                        const to = '/' + pathnames.slice(0, index + 1).join('/');

                        let label = breadcrumbNameMap[value] || decodeURIComponent(value);

                        // ✅ Cập nhật logic để hiển thị tên ngôn ngữ
                        if (pathnames[0] === 'client' && pathnames[1] === 'course' && index === 2) {
                            label = decodeURIComponent(value); // Tên ngôn ngữ
                        }

                        // ✅ Cập nhật logic để hiển thị tên khóa học
                        if (pathnames[0] === 'client' && pathnames[1] === 'course' && index === 3 && courseTitle) {
                            label = courseTitle;
                        }

                        return (
                            <li key={to} className="flex items-center">
                                <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                                {isLast ? (
                                    <motion.span
                                        className="text-gray-500 dark:text-gray-400 font-medium"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        {label}
                                    </motion.span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="text-blue-600 hover:underline font-medium transition"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </motion.nav>
    );
};

export default Breadcrumbs;