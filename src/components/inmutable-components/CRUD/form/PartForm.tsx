// src/components/inmutable-components/CRUD/form/PartForm.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Label } from '@/components/reusable-components/label';
import { Textarea } from '@/components/reusable-components/textarea'; // ✅ Thêm Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/reusable-components/select';
import api from "@/api";

interface Module {
  id: number;
  name: string;
  courseId: number;
}

interface Course {
  id: number;
  name: string;
}

interface Language {
  id: number;
  name: string;
}

// ✅ Cập nhật Part interface
export interface Part {
  id: number;
  name: string;
  type: 'video' | 'document'; // ✅ Đổi exercise thành document
  moduleId: number;
  moduleName: string;
  status: 'active' | 'inactive';
  content?: string; // ✅ Thêm trường content
  videoUrl?: string; // ✅ Thêm trường videoUrl
  duration?: string; // ✅ Thêm trường duration
}

interface PartFormProps {
  initialData?: Part;
  onSubmit: (data: Omit<Part, 'id'>) => Promise<void>;
}

const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0); // ✅ Fix: Khởi tạo là 0
  const [formData, setFormData] = useState<Omit<Part, 'id'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'video',
    moduleId: initialData?.moduleId || 0,
    moduleName: initialData?.moduleName || '',
    status: initialData?.status || 'active',
    content: initialData?.content || '', // ✅ Khởi tạo state cho content
    videoUrl: initialData?.videoUrl || '', // ✅ Khởi tạo state cho videoUrl
    duration: initialData?.duration || '', // ✅ Khởi tạo state cho duration
  });

  // ✅ Hàm xử lý upload file
  const handleUploadFile = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await api.post('/api/uploads', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data.url;
      // Gán URL vào trường tương ứng
      if (formData.type === 'video') {
        setFormData(fd => ({ ...fd, videoUrl: fileUrl, content: '' }));
        toast.success('Upload video thành công!');
      } else {
        // Tài liệu, ví dụ là PDF hoặc nội dung text
        setFormData(fd => ({ ...fd, content: fileUrl, videoUrl: '' }));
        toast.success('Upload tài liệu thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      toast.error('Upload thất bại.');
    }
  };

  // ✅ Hàm xử lý sự kiện file input thay đổi
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  // Fetch languages khi mở form
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await api.get<Language[]>('/api/languages');
        setLanguages(res.data);
        if (initialData) {
          // Logic khi edit: tìm ngôn ngữ từ courseId của module
          const moduleRes = await api.get<Module>(`/api/modules/${initialData.moduleId}`);
          const courseRes = await api.get<Course & { languageId: number }>(`/api/courses/${moduleRes.data.courseId}`);
          setSelectedLanguageId(courseRes.data.languageId);
        } else if (res.data.length > 0) {
          setSelectedLanguageId(res.data[0].id);
        }
      } catch {
        toast.error('Không tải được danh sách ngôn ngữ', { autoClose: 1200 });
      }
    };
    fetchLanguages();
  }, [initialData]);

  // Fetch courses khi chọn ngôn ngữ
  useEffect(() => {
    if (!selectedLanguageId) return;
    const fetchCourses = async () => {
      try {
        const res = await api.get<Course[]>(`/api/courses/by-language/${selectedLanguageId}`);
        setCourses(res.data);
        if (initialData) {
          const moduleRes = await api.get<Module>(`/api/modules/${initialData.moduleId}`);
          setSelectedCourseId(moduleRes.data.courseId);
        } else if (res.data.length > 0) {
          setSelectedCourseId(res.data[0].id);
        }
      } catch {
        toast.error('Không tải được danh sách courses', { autoClose: 1200 });
      }
    };
    fetchCourses();
  }, [selectedLanguageId, initialData]);

  // Fetch modules khi chọn course
  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchModules = async () => {
      try {
        const res = await api.get<Module[]>(`/api/modules`, {
          params: { courseId: selectedCourseId },
        });
        setModules(res.data);
        if (initialData && initialData.moduleId) {
          setFormData(fd => ({
            ...fd,
            moduleId: initialData.moduleId,
            moduleName: modules.find(m => m.id === initialData.moduleId)?.name || '',
          }));
        } else if (res.data.length > 0) {
          setFormData(fd => ({
            ...fd,
            moduleId: res.data[0].id,
            moduleName: res.data[0].name,
          }));
        }
      } catch {
        toast.error('Không tải được danh sách modules', { autoClose: 1200 });
      }
    };
    fetchModules();
  }, [selectedCourseId, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Part Title</Label>
            <Input_admin
                value={formData.name}
                onChange={e =>
                    setFormData(fd => ({ ...fd, name: e.target.value }))
                }
                required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
                value={formData.type}
                onValueChange={(v: 'video' | 'document') => // ✅ Cập nhật type
                    setFormData(fd => ({ ...fd, type: v, videoUrl: '', content: '' })) // ✅ Reset content/videoUrl
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem> {/* ✅ Đổi tên */}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ✅ Thêm trường Video URL/Document và Duration */}
        {formData.type === 'video' ? (
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="flex items-center gap-2">
                <Input_admin
                    value={formData.videoUrl || ''}
                    onChange={e => setFormData(fd => ({ ...fd, videoUrl: e.target.value }))}
                    placeholder="Paste YouTube or other video URL here"
                />
                {/* ✅ Nút Upload file */}
                <Label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                  Upload Video
                  <input type="file" className="hidden" accept="video/*" onChange={onFileChange} />
                </Label>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Duration (in minutes, e.g., 5:30)</Label>
                <Input_admin
                    value={formData.duration || ''}
                    onChange={e => setFormData(fd => ({ ...fd, duration: e.target.value }))}
                    placeholder="e.g., 5:30"
                />
              </div>
            </div>
        ) : (
            <div className="space-y-2">
              <Label>Content (Document/Text)</Label>
              <div className="flex items-center gap-2">
                <Textarea
                    value={formData.content || ''}
                    onChange={e => setFormData(fd => ({ ...fd, content: e.target.value }))}
                    placeholder="Enter document content here or upload file"
                />
                {/* ✅ Nút Upload file */}
                <Label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                  Upload Document
                  <input type="file" className="hidden" accept=".pdf, .docx, .txt" onChange={onFileChange} />
                </Label>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Duration (in minutes, e.g., 5:30)</Label>
                <Input_admin
                    value={formData.duration || ''}
                    onChange={e => setFormData(fd => ({ ...fd, duration: e.target.value }))}
                    placeholder="e.g., 5:30"
                />
              </div>
            </div>
        )}

        {/* Language, Course & Module */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ... (phần code này giữ nguyên) ... */}
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
                value={selectedLanguageId ? String(selectedLanguageId) : ''}
                onValueChange={v => {
                  setSelectedLanguageId(Number(v));
                  setSelectedCourseId(0);
                  setModules([]);
                  setFormData(fd => ({ ...fd, moduleId: 0, moduleName: '' }));
                }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(l => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Course</Label>
            <Select
                value={selectedCourseId ? String(selectedCourseId) : ''}
                onValueChange={v => {
                  setSelectedCourseId(Number(v));
                  setModules([]);
                  setFormData(fd => ({ ...fd, moduleId: 0, moduleName: '' }));
                }}
                disabled={!selectedLanguageId || courses.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Module</Label>
            <Select
                value={formData.moduleId ? String(formData.moduleId) : ''}
                onValueChange={v => {
                  const m = modules.find(x => x.id === Number(v));
                  if (m) {
                    setFormData(fd => ({
                      ...fd,
                      moduleId: m.id,
                      moduleName: m.name,
                    }));
                  }
                }}
                disabled={!selectedCourseId || modules.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map(m => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
              value={formData.status}
              onValueChange={(v: 'active' | 'inactive') =>
                  setFormData(fd => ({ ...fd, status: v }))
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

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button_admin type="submit">
            {initialData ? 'Update Part' : 'Create New Part'}
          </Button_admin>
        </div>
      </form>
  );
};

export default PartForm;