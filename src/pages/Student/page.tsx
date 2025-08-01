export {}
// 'use client';
//
// import { useEffect, useState } from 'react';
// import { fetchStudentCourses } from './api';
// import StudentCourseCard from './StudentCourseCard';
// import { StudentCourseProgress } from './types';
//
//
// export default function StudentDashboardPage() {
//     const [courses, setCourses] = useState<StudentCourseProgress[]>([]);
//     const [loading, setLoading] = useState(true);
//     const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
//
//     useEffect(() => {
//         if (!token) return;
//         fetchStudentCourses(token)
//             .then(setCourses)
//             .catch((err) => console.error(err))
//             .finally(() => setLoading(false));
//     }, [token]);
//
//     if (loading) return <div>Đang tải...</div>;
//
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {courses.map((course) => (
//                 <StudentCourseCard key={course.courseId} course={course} />
//             ))}
//         </div>
//     );
// }
