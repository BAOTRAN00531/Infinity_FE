// src/components/student/course/StudentModules.tsx

import { useEffect, useState } from 'react';
import api from '@/api';
import { StudentLessons } from './StudentLessons';
import { FiChevronDown, FiChevronRight, FiCheckCircle, FiClock } from 'react-icons/fi';

export interface StudentModule {
    id: number;
    name: string;
    description: string;
    courseId: number;
    courseName: string;
    order: number;
    duration: string;
    status: string;
    partsCount: number;
    completedLessons: number;
    totalLessons: number;
    moduleProgress: number;
}

interface StudentModulesProps {
    courseId: number;
}

export function StudentModules({ courseId }: StudentModulesProps) {
    const [modules, setModules] = useState<StudentModule[]>([]);
    const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get(`/api/student/module/by-course/${courseId}`)
            .then((res) => {
                setModules(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Lỗi tải module:', err);
                setError('Không thể tải danh sách module');
                setLoading(false);
            });
    }, [courseId]);

    const toggleModule = (id: number) => {
        setExpandedModuleId((prev) => (prev === id ? null : id));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4 bg-red-50 rounded-lg text-center">{error}</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Các module trong khóa học</h3>
                <p className="text-gray-600">Nhấn vào từng module để xem chi tiết bài học</p>
            </div>

            <div className="space-y-4">
                {modules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <FiClock className="mx-auto text-3xl mb-2 text-gray-400" />
                        <p>Chưa có module nào trong khóa học này.</p>
                    </div>
                ) : (
                    modules.map((mod) => (
                        <div key={mod.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                            <div
                                className="flex justify-between items-start p-5 bg-white cursor-pointer"
                                onClick={() => toggleModule(mod.id)}
                            >
                                <div className="flex items-start flex-1">
                                    <div className="mr-4 text-blue-500 mt-1">
                                        {expandedModuleId === mod.id ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        Module {mod.order}
                      </span>
                                            <h3 className="text-lg font-semibold text-gray-800">{mod.name}</h3>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3">{mod.description}</p>

                                        <div className="flex items-center text-sm text-gray-500">
                                            <FiClock className="mr-1" />
                                            <span className="mr-4">{mod.duration}</span>

                                            <div className="flex items-center">
                                                <FiCheckCircle className="mr-1" />
                                                <span>{mod.completedLessons}/{mod.totalLessons} bài hoàn thành</span>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${mod.moduleProgress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{mod.moduleProgress}% hoàn thành</div>
                                    </div>
                                </div>

                                <div className="text-right ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {mod.partsCount} bài học
                  </span>
                                </div>
                            </div>

                            {expandedModuleId === mod.id && (
                                <div className="bg-gray-50 border-t border-gray-200">
                                    <StudentLessons moduleId={mod.id} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}