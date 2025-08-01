import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { Calendar, Clock, Layers, Globe } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  description: string;
  language: { id: number; name: string };
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'inactive';
  createdAt: string;
  modulesCount: number;
  price: number;
  thumbnail?: string;// ✅ thêm dòng này
}


interface CourseDetailsProps {
  course: Course;
}

const CourseDetails = ({ course }: CourseDetailsProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail image */}
          {course.thumbnail && (
              <div className="flex-shrink-0">
                <img
                    src={course.thumbnail}
                    alt="Course Thumbnail"
                    className="w-full md:w-64 h-40 md:h-48 object-cover rounded-2xl shadow"
                />
              </div>
          )}

          {/* Course main info */}
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-black text-gray-800">{course.name}</h3>
            <p className="text-gray-600">{course.description}</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Badge className={`text-sm font-bold rounded-full ${getLevelColor(course.level)}`}>
                {course.level}
              </Badge>
              <Badge className={`text-sm font-bold rounded-full ${
                  course.status === 'active'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {course.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Grid info below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Language</p>
              <p className="font-bold text-gray-800">{course.language.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
            <Layers className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <p className="font-bold text-gray-800">{course.modulesCount} modules</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl">
            <span className="w-5 h-5 text-pink-600 font-bold text-lg">₫</span>
            <div>
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="font-bold text-gray-800">{course.price.toLocaleString()} VND</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Created</p>
              <p className="font-bold text-gray-800">{course.createdAt}</p>
            </div>
          </div>
        </div>
      </div>
  );

};

export default CourseDetails;
