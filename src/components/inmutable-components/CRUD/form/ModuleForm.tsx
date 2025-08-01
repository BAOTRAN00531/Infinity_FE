import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button_admin } from '@/components/reusable-components/button_admin'
import { Input_admin } from '@/components/reusable-components/input_admin'
import { Label } from '@/components/reusable-components/label'
import { Textarea } from '@/components/reusable-components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/reusable-components/select'

/** Định nghĩa kiểu Course để fetch dropdown */
interface Language {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
  languageId: number;
}

/** Kiểu dữ liệu form truyền lên BE (mapping sang DTO) */
export interface Module {
  id: number
  name: string
  description: string
  courseId: number
  courseName: string
  order: number
  status: 'active' | 'inactive'
  partsCount: number
}

export interface ModuleRequest {
  name: string;
  description: string;
  courseId: number;
  order: number;
  status: 'active' | 'inactive';
}


/** Props mà ModulesCRUD truyền vào */
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
  });

  // Fetch languages và courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const [langRes, courseRes] = await Promise.all([
          axios.get<Language[]>('http://localhost:8080/api/languages', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get<Course[]>('http://localhost:8080/api/courses', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setLanguages(langRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        toast.error('Không tải được dữ liệu', {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      }
    };
    fetchData();
  }, []);

  // Khi chọn ngôn ngữ, gọi API lấy courses theo ngôn ngữ
  useEffect(() => {
    if (selectedLanguageId) {
      const fetchCoursesByLanguage = async () => {
        try {
          const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
          const res = await axios.get(`http://localhost:8080/api/courses/by-language/${selectedLanguageId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFilteredCourses(res.data);
          setFormData(fd => ({ ...fd, courseId: 0, courseName: '' })); // reset course khi đổi ngôn ngữ
        } catch (err) {
          setFilteredCourses([]);
          setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
        }
      };
      fetchCoursesByLanguage();
    } else {
      setFilteredCourses([]);
      setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
    }
  }, [selectedLanguageId]);

  // Sau khi chọn course, tự động tăng order
  useEffect(() => {
    if (formData.courseId) {
      const fetchModules = async () => {
        try {
          const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
          const res = await axios.get(`http://localhost:8080/api/modules?courseId=${formData.courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const maxOrder = res.data.reduce((max: number, m: any) => Math.max(max, m.order), 0);
          setFormData(fd => ({ ...fd, order: maxOrder + 1 }));
        } catch (err) {
          setFormData(fd => ({ ...fd, order: 1 }));
        }
      };
      fetchModules();
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
      })
    }
  }, [initialData])

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
