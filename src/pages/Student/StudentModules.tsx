import { useEffect, useState } from 'react';
import api from '@/api'; // Sử dụng instance api đã cấu hình
import { StudentLesson, StudentLessons } from './StudentLessons';

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
}

interface StudentModulesProps {
    courseId: number;
}

export function StudentModules({ courseId }: StudentModulesProps) {
    const [modules, setModules] = useState<StudentModule[]>([]);
    const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api
            .get(`/api/student/module/by-course/${courseId}`)
            .then((res) => setModules(res.data))
            .catch((err) => {
                console.error('Lỗi tải module:', err);
                setError('Không thể tải danh sách module');
            });
    }, [courseId]);

    const toggleModule = (id: number) => {
        setExpandedModuleId((prev) => (prev === id ? null : id));
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Danh sách Module</h2>
            <div className="space-y-4">
                {modules.length === 0 ? (
                    <p className="text-gray-600">Không có module nào.</p>
                ) : (
                    modules.map((mod) => (
                        <div key={mod.id} className="border rounded-lg p-4 shadow">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleModule(mod.id)}
                            >
                                <div>
                                    <h3 className="text-lg font-medium">{mod.name}</h3>
                                    <p className="text-sm text-gray-600">{mod.description}</p>
                                </div>
                                <span className="text-sm text-blue-600">
                  {expandedModuleId === mod.id ? 'Ẩn' : 'Xem bài học'}
                </span>
                            </div>

                            {expandedModuleId === mod.id && (
                                <div className="mt-4">
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