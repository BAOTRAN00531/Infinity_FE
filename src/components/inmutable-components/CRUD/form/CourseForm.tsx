// src/components/inmutable-components/CRUD/form/CourseForm.tsx

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
import { toast } from 'react-toastify';
import api from "@/api";
import { Language, Course, CourseLevel, CourseStatus } from '@/types'; // ✅ Import đầy đủ các types cần thiết

interface CourseFormProps {
  initialData?: Course;
  // ✅ Cập nhật type của onSubmit để khớp với hàm async
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'modulesCount'>) => Promise<void>;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [formData, setFormData] = useState<
      Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'modulesCount'>
  >({
    name: initialData?.name || '',
    description: initialData?.description || '',
    language: initialData?.language || {} as Language,
    level: initialData?.level || 'Beginner',
    duration: initialData?.duration || null, // ✅ Đảm bảo trường này tồn tại
    price: initialData?.price || 0,
    thumbnail: initialData?.thumbnail || '',
    status: initialData?.status || 'active',
  });

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/api/languages');
      setLanguages(res.data);
    } catch {
      toast.error('Failed to load languages', { autoClose: 1200 });
    }
  };

  const handleUploadThumbnail = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await api.post('/api/uploads', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, thumbnail: res.data.url }));
      toast.success('Uploaded thumbnail successfully', { autoClose: 1200 });
    } catch {
      toast.error('Failed to upload thumbnail', { autoClose: 1200 });
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLanguage = languages.find(lang => lang.id === formData.language.id);
    if (!selectedLanguage) {
      toast.error('Please select a language', { autoClose: 1200 });
      return;
    }
    onSubmit({ ...formData, language: selectedLanguage });
  };

  const handleLanguageChange = (value: string) => {
    const selectedLang = languages.find(lang => lang.id === parseInt(value));
    if (selectedLang) {
      setFormData(prev => ({
        ...prev,
        language: selectedLang,
      }));
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <Label htmlFor="name">Course Name</Label>
            <Input_admin
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="language">Language</Label>
            <Select
                value={formData.language.id?.toString() || ''}
                onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
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
        </div>
        {/* ... giữ nguyên các trường khác ... */}
        <div className="space-y-2 text-sm font-bold text-gray-700 dark:text-gray-200">
          <Label htmlFor="description">Description</Label>
          <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
                value={formData.level}
                onValueChange={(val) => setFormData({ ...formData, level: val as CourseLevel })}
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val as CourseStatus })}
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
          <div className="space-y-2">
            <Label htmlFor="price">Price (VND)</Label>
            <Input_admin
                id="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="Nhập giá khóa học"
                required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image</Label>
            <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadThumbnail(file);
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {formData.thumbnail && (
                <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="mt-2 rounded-lg border w-40 h-24 object-cover"
                />
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button_admin type="submit" className="...">{initialData ? 'Update Course' : 'Create Course'}</Button_admin>
        </div>
      </form>
  );
};

export default CourseForm;