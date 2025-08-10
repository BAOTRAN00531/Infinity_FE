import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Label } from '@/components/reusable-components/label';
import { Textarea } from '@/components/reusable-components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/reusable-components/select';
import { Language, Course, Module, ModuleRequest } from '@/types';
import { fetchLanguages, fetchCourses, fetchCoursesByLanguage, fetchModules } from '@/api/module.service';

interface ModuleFormProps {
  initialData?: Module;
  onSubmit: (data: ModuleRequest) => Promise<void>;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ initialData, onSubmit }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<Omit<Module, 'id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    courseId: initialData?.courseId || 0,
    courseName: initialData?.courseName || 'Select a course',
    order: initialData?.order || 1,
    status: initialData?.status || 'active',
    partsCount: initialData?.partsCount || 0,
    duration: initialData?.duration || '',
  });

  // Fetch languages và courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [langRes, courseRes] = await Promise.all([
          fetchLanguages(),
          fetchCourses(),
        ]);
        setLanguages(langRes);
        setCourses(courseRes);
        // Nếu có initialData, tự động chọn ngôn ngữ của khóa học
        if (initialData?.courseId) {
          const course = courseRes.find(c => c.id === initialData.courseId);
          if (course?.language?.id) {
            setSelectedLanguageId(course.language.id);
          }
        }
      } catch (err) {
        toast.error('Không tải được dữ liệu', { autoClose: 1200 });
      }
    };
    fetchData();
  }, [initialData]);

  // Khi chọn ngôn ngữ, gọi API lấy courses theo ngôn ngữ
  useEffect(() => {
    if (selectedLanguageId) {
      const fetchCoursesByLanguageData = async () => {
        try {
          const res = await fetchCoursesByLanguage(selectedLanguageId);
          setFilteredCourses(res);
          // Nếu initialData có courseId, giữ lại courseId và courseName
          if (!initialData?.courseId) {
            setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
          }
        } catch {
          setFilteredCourses([]);
          setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
        }
      };
      fetchCoursesByLanguageData();
    } else {
      setFilteredCourses([]);
      setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
    }
  }, [selectedLanguageId, initialData]);

  // Sau khi chọn course, tự động tăng order
  useEffect(() => {
    if (formData.courseId) {
      const fetchModulesData = async () => {
        try {
          const res = await fetchModules(formData.courseId);
          const maxOrder = res.reduce((max: number, m: Module) => Math.max(max, m.order), 0);
          setFormData(fd => ({ ...fd, order: maxOrder + 1 }));
        } catch {
          setFormData(fd => ({ ...fd, order: 1 }));
        }
      };
      fetchModulesData();
    }
  }, [formData.courseId]);

  // Đồng bộ lại khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        courseId: initialData.courseId,
        courseName: initialData.courseName,
        order: initialData.order,
        status: initialData.status,
        partsCount: initialData.partsCount,
        duration: initialData.duration || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ModuleRequest = {
      name: formData.name,
      description: formData.description,
      courseId: formData.courseId,
      order: formData.order,
      status: formData.status,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Chọn ngôn ngữ */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Language</Label>
        <Select
          value={selectedLanguageId?.toString() || ''}
          onValueChange={value => setSelectedLanguageId(Number(value))}
        >
          <SelectTrigger className="rounded-2xl border-2 border-gray-200">
            <SelectValue placeholder="Chọn ngôn ngữ" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {languages.map(lang => (
              <SelectItem key={lang.id} value={lang.id.toString()}>{lang.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chọn course (lọc theo ngôn ngữ) */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Course</Label>
        <Select
          value={formData.courseId ? formData.courseId.toString() : ''}
          onValueChange={value => {
            const id = Number(value);
            const found = filteredCourses.find(c => c.id === id);
            setFormData({ ...formData, courseId: id, courseName: found?.name || '' });
          }}
          disabled={!selectedLanguageId}
        >
          <SelectTrigger className="rounded-2xl border-2 border-gray-200">
            <SelectValue placeholder="Chọn khoá học" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {filteredCourses.map(course => (
              <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Module Title</Label>
        <Input_admin
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Description</Label>
        <Textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
          required
        />
      </div>

      {/* Order / Status */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Status</Label>
          <Select
            value={formData.status}
            onValueChange={value => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
          >
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

      {/* Submit */}
      <div className="flex justify-end pt-6">
        <Button_admin
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          {initialData ? 'Update Module' : 'Create Module'}
        </Button_admin>
      </div>
    </form>
  );
}

export default ModuleForm
