import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { toast } from 'react-toastify';

interface Language {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  language: Language;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'inactive';
  createdAt: string;
  modulesCount: number;
}

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'modulesCount' | 'duration'>) => void;
}

const CourseForm = ({ initialData, onSubmit }: CourseFormProps) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageId, setLanguageId] = useState<number>(initialData?.language?.id || 0);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    level: initialData?.level || 'Beginner' as const,
    status: initialData?.status || 'active' as const,
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8080/api/languages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLanguages(res.data);
      } catch {
        toast.error('Failed to load languages');
      }
    };
    fetchLanguages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLanguage = languages.find(lang => lang.id === languageId);
    if (!selectedLanguage) {
      toast.error('Please select a language');
      return;
    }
    onSubmit({
      ...formData,
      language: selectedLanguage,
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-200">Course Name</Label>
            <Input_admin
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="language" className="text-sm font-bold text-gray-700 dark:text-gray-200">Language</Label>
            <Select
                value={languageId.toString()}
                onValueChange={(val) => setLanguageId(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-200">
          <Label htmlFor="description" className="text-sm font-bold text-gray-700 dark:text-gray-200">Description</Label>
          <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-bold text-gray-700 dark:text-gray-200">Level</Label>
            <Select
                value={formData.level}
                onValueChange={(val: 'Beginner' | 'Intermediate' | 'Advanced') =>
                    setFormData({ ...formData, level: val })
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-bold text-gray-700 dark:text-gray-200">Duration</Label>
            <div className="flex gap-2">
              <Input_admin
                id="duration-value"
                type="number"
                min={1}
                value={durationValue}
                onChange={e => setDurationValue(e.target.value)}
                placeholder="Số lượng"
                required
                className="w-24"
              />
              <Select
                value={durationUnit}
                onValueChange={val => setDurationUnit(val)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngày">Ngày</SelectItem>
                  <SelectItem value="tuần">Tuần</SelectItem>
                  <SelectItem value="tháng">Tháng</SelectItem>
                  <SelectItem value="năm">Năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-bold text-gray-700 dark:text-gray-200">Status</Label>
            <Select
                value={formData.status}
                onValueChange={(val: 'active' | 'inactive') =>
                    setFormData({ ...formData, status: val })
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button_admin
              type="submit"
              className="
    inline-flex items-center justify-center gap-2 whitespace-nowrap
    text-sm font-medium
    ring-offset-background
    transition-colors
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0
    hover:bg-primary/90
    h-10 px-4 py-2
    bg-gradient-to-r from-purple-500 to-pink-500
    text-white
    rounded-2xl
    shadow-md hover:shadow-lg
  "
          >
            {initialData ? 'Update Course' : 'Create Course'}
          </Button_admin>

        </div>
      </form>
  );
};

export default CourseForm;
