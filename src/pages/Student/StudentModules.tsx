import { useEffect, useState } from "react";
import axios from "axios";
import { StudentLesson, StudentLessons } from "./StudentLessons";

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

    useEffect(() => {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

        axios.get(`/api/student/module/by-course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setModules(res.data))
            .catch(err => console.error("Lỗi tải module:", err));
    }, [courseId]);

    const toggleModule = (id: number) => {
        setExpandedModuleId(prev => (prev === id ? null : id));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Danh sách Module</h2>
            <div className="space-y-4">
                {modules.map(mod => (
                    <div key={mod.id} className="border rounded-lg p-4 shadow">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleModule(mod.id)}>
                            <div>
                                <h3 className="text-lg font-medium">{mod.name}</h3>
                                <p className="text-sm text-gray-600">{mod.description}</p>
                            </div>
                            <span className="text-sm text-blue-600">{expandedModuleId === mod.id ? 'Ẩn' : 'Xem bài học'}</span>
                        </div>

                        {expandedModuleId === mod.id && (
                            <div className="mt-4">
                                <StudentLessons moduleId={mod.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
