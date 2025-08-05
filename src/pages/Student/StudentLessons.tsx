import { useEffect, useState } from "react";
import axios from "axios";

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

    useEffect(() => {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

        axios.get(`/api/student/lesson/by-module/${moduleId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setLessons(res.data))
            .catch(err => console.error("Lỗi tải bài học:", err));
    }, [moduleId]);

    return (
        <div className="pl-4">
            <h4 className="text-md font-semibold mb-2">Bài học</h4>
            <ul className="list-disc list-inside space-y-1">
                {lessons.map(lesson => (
                    <li key={lesson.id}>
                        <span className="font-medium">{lesson.name}</span> – {lesson.duration}
                    </li>
                ))}
            </ul>
        </div>
    );
}
