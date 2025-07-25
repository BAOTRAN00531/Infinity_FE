// pages/ClientCourseList.tsx
import React, { useEffect, useState } from 'react';
import { CourseCard } from './MiniComponent/CourseCard';
import Header from '@/components/layout-components/Header';
import axios from 'axios';
import { motion } from 'framer-motion';

interface CourseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    status: string;
}

const ClientCourseList: React.FC = () => {
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [sortPrice, setSortPrice] = useState<string>('');

    useEffect(() => {
        axios.get('/client/api/course').then((res) => setCourses(res.data));
    }, []);

    const filteredCourses = courses
        .filter((c) => (statusFilter ? c.status === statusFilter : true))
        .sort((a, b) => {
            if (sortPrice === 'asc') return a.price - b.price;
            if (sortPrice === 'desc') return b.price - a.price;
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-6 text-center">Chọn Khóa Học Phù Hợp</h1>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <select
                        className="bg-gray-800 px-4 py-2 rounded-xl text-white"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang mở</option>
                        <option value="INACTIVE">Đóng</option>
                    </select>
                    <select
                        className="bg-gray-800 px-4 py-2 rounded-xl text-white"
                        onChange={(e) => setSortPrice(e.target.value)}
                    >
                        <option value="">Sắp xếp theo giá</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ClientCourseList;
