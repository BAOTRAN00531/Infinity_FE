import React, { useEffect, useState } from 'react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Label } from '@/components/reusable-components/label';
import { Textarea } from '@/components/reusable-components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';

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

interface ModuleFormProps {
  initialData?: Module;
  onSubmit: (data: Omit<Module, 'id'>) => void;
}

const ModuleForm = ({ initialData, onSubmit }: ModuleFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    courseId: initialData?.courseId || 1,
    courseName: initialData?.courseName || 'Spanish Fundamentals',
    order: initialData?.order || 1,
    duration: initialData?.duration || '',
    status: initialData?.status || 'active' as const,
    partsCount: initialData?.partsCount || 0,
  });

  // ✅ Cập nhật form khi initialData thay đổi (Edit)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        courseId: initialData.courseId,
        courseName: initialData.courseName,
        order: initialData.order,
        duration: initialData.duration,
        status: initialData.status,
        partsCount: initialData.partsCount,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Module Title</Label>
            <Input_admin
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Course</Label>
            <Select value={formData.courseName} onValueChange={(value: string) => setFormData({ ...formData, courseName: value })}>
              <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Spanish Fundamentals">Spanish Fundamentals</SelectItem>
                <SelectItem value="Advanced French Conversation">Advanced French Conversation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Description</Label>
          <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
              required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Order</Label>
            <Input_admin
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Duration</Label>
            <Input_admin
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2 hours"
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button_admin
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {initialData ? 'Update Module' : 'Create Module'}
          </Button_admin>
        </div>
      </form>
  );
};

export default ModuleForm;
