import { useEffect, useState } from 'react';
import api from '@/api'; // Sử dụng instance api đã cấu hình

export interface StudentLesson {
    id: number;
    name: string;
    description: string;
    content: string;
    type: string;
    orderIndex: number;
    duration: string;
    status: string;
    moduleId: number;
    moduleName: string;
    createdBy: number;
    createdAt: string;
    updatedBy: number | null;
    updatedAt: string | null;
}

interface StudentLessonsProps {
    moduleId: number;
}

export function StudentLessons({ moduleId }: StudentLessonsProps) {
    const [lessons, setLessons] = useState<StudentLesson[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api
            .get(`/api/student/lesson/by-module/${moduleId}`)
            .then((res) => setLessons(res.data))
            .catch((err) => {
                console.error('Lỗi tải bài học:', err);
                setError('Không thể tải danh sách bài học');
            });
    }, [moduleId]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="pl-4">
            <h4 className="text-md font-semibold mb-2">Bài học</h4>
            {lessons.length === 0 ? (
                <p className="text-gray-600">Không có bài học nào.</p>
            ) : (
                <ul className="list-disc list-inside space-y-1">
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <span className="font-medium">{lesson.name}</span> – {lesson.duration}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}