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
import { fetchLanguages, fetchCourses, fetchModules } from '@/api/module.service';

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
    courseName: initialData?.courseName || '',
    order: initialData?.order || 1,
    status: initialData?.status || 'active',
    partsCount: initialData?.partsCount || 0,
    duration: initialData?.duration || null,
  });

  // ✅ Effect chính để fetch data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [langRes, courseRes] = await Promise.all([
          fetchLanguages(),
          fetchCourses(),
        ]);

        setLanguages(langRes);
        setCourses(courseRes);

        // ✅ Auto-fill ngôn ngữ nếu là edit mode - SỬA LẠI LOGIC
        if (initialData?.courseId) {
          const selectedCourse = courseRes.find(c => c.id === initialData.courseId);
          if (selectedCourse?.language?.id) {
            // console.log('Auto-filling language:', selectedCourse.language); // Debug log
            // ✅ Set với delay nhỏ để đảm bảo languages đã được set
            setTimeout(() => {
              setSelectedLanguageId(selectedCourse.language.id);
            }, 100);
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        toast.error('Không tải được dữ liệu', { autoClose: 1200 });
      }
    };

    fetchInitialData();
  }, []); // Chỉ chạy 1 lần khi component mount

  // ✅ Effect để auto-fill form data khi có initialData
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
        duration: initialData.duration,
      });
    }
  }, [initialData]);

  // ✅ Effect để lọc courses khi thay đổi ngôn ngữ
  useEffect(() => {
    if (selectedLanguageId && courses.length > 0) {
      const coursesByLang = courses.filter(course => course.language.id === selectedLanguageId);
      setFilteredCourses(coursesByLang);

      // Reset courseId nếu course hiện tại không thuộc ngôn ngữ đã chọn (chỉ khi không phải edit mode ban đầu)
      const isCurrentCourseInLanguage = coursesByLang.some(c => c.id === formData.courseId);
      if (!isCurrentCourseInLanguage && !initialData) {
        setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
      }
    } else {
      // Nếu chưa chọn ngôn ngữ, hiển thị tất cả courses
      setFilteredCourses(courses);
    }

    // Debug log
    // console.log('Filter effect - selectedLanguageId:', selectedLanguageId, 'courses.length:', courses.length);
  }, [selectedLanguageId, courses, formData.courseId, initialData]);

  // ✅ Effect để auto-increment order khi chọn course
  useEffect(() => {
    if (formData.courseId && (!initialData || initialData.courseId !== formData.courseId)) {
      const fetchModulesData = async () => {
        try {
          const res = await fetchModules(formData.courseId);
          const maxOrder = res.reduce((max: number, m: Module) => Math.max(max, m.order), 0);
          setFormData(fd => ({ ...fd, order: maxOrder + 1 }));
        } catch (error) {
          console.error('Error fetching modules:', error);
          setFormData(fd => ({ ...fd, order: 1 }));
        }
      };
      fetchModulesData();
    }
  }, [formData.courseId, initialData]);

  const handleLanguageChange = (value: string) => {
    const newLangId = Number(value);
    setSelectedLanguageId(newLangId);

    // Chỉ reset course selection nếu không phải edit mode
    if (!initialData) {
      setFormData(fd => ({ ...fd, courseId: 0, courseName: '' }));
    }
  };

  const handleCourseChange = (value: string) => {
    const id = Number(value);
    const found = filteredCourses.find(c => c.id === id);
    setFormData({ ...formData, courseId: id, courseName: found?.name || '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseId) {
      toast.error('Vui lòng chọn khóa học', { autoClose: 1200 });
      return;
    }

    const payload: ModuleRequest = {
      name: formData.name,
      description: formData.description,
      courseId: formData.courseId,
      order: formData.order,
      status: formData.status,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Selection - Auto-filled trong edit mode */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
            Language {initialData && '(Auto-filled)'}
          </Label>
          <Select
              value={selectedLanguageId?.toString() || ''}
              onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue placeholder="Chọn ngôn ngữ" />
              {/* Debug info */}
              {/*{console.log('Render - selectedLanguageId:', selectedLanguageId, 'languages.length:', languages.length)}*/}
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {languages.map(lang => (
                  <SelectItem key={lang.id} value={lang.id.toString()}>
                    <div className="flex items-center gap-2">
                      <img src={lang.flag} alt={lang.code} className="w-4 h-3 rounded-sm" />
                      {lang.name}
                    </div>
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Selection - Auto-filled trong edit mode */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
            Course {initialData && '(Auto-filled)'}
          </Label>
          <Select
              value={formData.courseId ? formData.courseId.toString() : ''}
              onValueChange={handleCourseChange}
              disabled={!selectedLanguageId}
          >
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {filteredCourses.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Module Title */}
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

        {/* Order & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Order</Label>
            <Input_admin
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                min="1"
                required
            />
          </div>

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

        {/* Submit Button */}
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
};

export default ModuleForm;