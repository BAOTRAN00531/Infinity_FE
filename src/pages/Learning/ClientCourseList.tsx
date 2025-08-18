import React, { useEffect, useState } from 'react';
import { CourseCard } from './MiniComponent/CourseCard';
import Header from '@/components/layout-components/Header';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layout-components/PageLayout';
import { useParams } from 'react-router-dom';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/reusable-components/select';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Skeleton } from '@/components/reusable-components/skeleton';
import api from '@/api';
import {toast} from "react-toastify";

interface CourseDto {
    id: number;
    name: string;
    description: string;
    language: string;
    price: number;
    status: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const ClientCourseList: React.FC = () => {
    const { languageName } = useParams<{ languageName: string }>();
    const [allCourses, setAllCourses] = useState<CourseDto[]>([]);
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [sortPrice, setSortPrice] = useState<string>('NONE');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch data một lần duy nhất
    useEffect(() => {
        setLoading(true);
        api.get('/client/api/course')
            .then((res) => {
                const fetchedCourses = res.data;
                //console.log('✅ API Fetched successfully. Total courses:', fetchedCourses.length, fetchedCourses); // ✅ log toàn bộ dữ liệu
                setAllCourses(fetchedCourses);
                setLoading(false);
            })
            .catch((error) => {
              //  console.error('❌ Error fetching courses:', error); // ✅ log lỗi nếu có
                setLoading(false);
                toast.error('Có lỗi xảy ra khi tải khoá học!');
            });
    }, []);

    // Lọc danh sách theo ngôn ngữ
    useEffect(() => {
        //console.log('🔄 Filtering courses by language...'); // ✅ log bắt đầu lọc
        //console.log('   - Language from URL:', languageName);
        //console.log('   - All courses count:', allCourses.length);

        if (allCourses.length > 0) {
            const filteredByLanguage = allCourses.filter(
                (course) => course.language?.toLowerCase() === languageName?.toLowerCase()
            );
           // console.log('   - Filtered by language. Count:', filteredByLanguage.length, filteredByLanguage); // ✅ log kết quả lọc
            setCourses(filteredByLanguage);
        }
    }, [allCourses, languageName]);

    // Lọc và sắp xếp dựa trên các bộ lọc khác
    useEffect(() => {
        let result = [...courses];

       // console.log('🔄 Filtering and sorting. Courses count:', courses.length); // ✅ log khi bắt đầu lọc/sắp xếp

        // Filter by status
        if (statusFilter !== 'ALL') {
            result = result.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Search by name
        if (searchQuery.trim()) {
            result = result.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort price
        if (sortPrice === 'asc') result.sort((a, b) => a.price - b.price);
        else if (sortPrice === 'desc') result.sort((a, b) => b.price - a.price);

       // console.log('   - Final filtered courses count:', result.length); // ✅ log kết quả cuối cùng
        setFilteredCourses(result);
    }, [courses, statusFilter, sortPrice, searchQuery]);

    return (
        <PageLayout>
            <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-gray-900 dark:text-white">
                        📚 Khám Phá Các Khoá Học {languageName ? `Tiếng ${languageName}` : ''}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Input_admin
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 Tìm theo tên khoá học"
                            className="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                        />
                        <Select onValueChange={(val) => setStatusFilter(val)} defaultValue="ALL">
                            <SelectTrigger className="w-44 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="active">Đang mở</SelectItem>
                                <SelectItem value="inactive">Đã đóng</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(val) => setSortPrice(val)} defaultValue="NONE">
                            <SelectTrigger className="w-44 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <SelectValue placeholder="Sắp xếp giá" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                <SelectItem value="NONE">Không sắp xếp</SelectItem>
                                <SelectItem value="asc">Tăng dần</SelectItem>
                                <SelectItem value="desc">Giảm dần</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="text-sm text-gray-400 text-center mb-4">
                        Hiển thị {filteredCourses.length}/{courses.length} khoá học
                    </p>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {loading ? (
                            Array.from({ length: 8 }).map((_, idx) => (
                                <Skeleton key={idx} className="h-48 rounded-xl bg-gray-800" />
                            ))
                        ) : filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400">Không có khoá học phù hợp</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientCourseList;