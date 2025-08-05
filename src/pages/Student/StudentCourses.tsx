import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { StudentModules } from "./StudentModules";
import PageLayout from "@/components/layout-components/PageLayout";

export interface Course {
    courseId: number;
    courseName: string;
    thumbnail: string;
    price: number;
    totalModules: number;
    completedModules: number;
    progressPercentage: number;
}

export default function StudentCourses() {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

    useEffect(() => {
        axios.get(`/api/student/course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setCourse(res.data))
            .catch(err => console.error(err));
    }, [courseId]);

    if (!course) return <p className="text-center text-gray-500">Đang tải khóa học...</p>;

    return (
        <PageLayout>

        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
            <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-full h-auto rounded shadow mb-4"
            />

            <div className="mb-4">
                <p><strong>Giá:</strong> {course.price} VNĐ</p>
                <p><strong>Số module:</strong> {course.totalModules}</p>
                <p><strong>Hoàn thành:</strong> {course.completedModules}</p>
                <div className="w-full bg-gray-200 rounded h-4 mt-2">
                    <div
                        className="bg-green-500 h-4 rounded"
                        style={{ width: `${course.progressPercentage}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-1">{course.progressPercentage}% hoàn thành</p>
            </div>

            <StudentModules courseId={course.courseId} />
        </div>
            </PageLayout>
    );
}
