
import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { Clock, Hash, BookOpen, FileText } from 'lucide-react';

interface Module {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  order: number;
  duration: string;
  status: 'active' | 'inactive';
  partsCount: number;
}

interface ModuleDetailsProps {
  module: Module;
}

const ModuleDetails = ({ module }: ModuleDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-blue-600 bg-blue-200 px-3 py-1 rounded-full">
            Module #{module.order}
          </span>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">{module.title}</h3>
        <p className="text-gray-600">{module.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
            <BookOpen className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Course</p>
              <p className="font-bold text-gray-800">{module.courseName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
            <Hash className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Order</p>
              <p className="font-bold text-gray-800">#{module.order}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="font-bold text-gray-800">{module.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Parts</p>
              <p className="font-bold text-gray-800">{module.partsCount} parts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <Badge className={`text-sm font-bold rounded-full ${
            module.status === 'active' 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            {module.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetails;
