import React, { useEffect, useState, useRef } from 'react';
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
import api from "@/api";
import { getCoursesByLanguage, getCourseById } from '@/api/course.service';
import { fetchLanguages, fetchModules, fetchModuleById } from '@/api/module.service';
import {Course, Language, Module, Part, PartRequest} from '@/types';

// ✅ Export the interfaces for use in PartsCRUD.tsx
// export interface Part {
//   description: string;
//   id: number;
//   name: string;
//   type: 'video' | 'document';
//   moduleId: number;
//   moduleName: string;
//   status: 'active' | 'inactive';
//   content?: string;
//   videoUrl?: string;
//   duration?: string;
// }

export interface PartFormProps {
  initialData?: Part;
  onSubmit: (data: PartRequest) => Promise<void>;
}

const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Replace selectedLanguageId with selectedLanguage
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();

  const [formData, setFormData] = useState<PartRequest>({
    name: '',
    description: '',
    type: 'video',
    moduleId: 0,
    status: 'active',
    content: '',
    videoUrl: '',
    duration: '',
  });

  // ✅ Use useRef to control the initial render and prevent useEffect conflicts
  const isInitialMount = useRef(true);

  // ✅ Main Effect: Load initial data and fill the form (for both create and edit)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      console.log("Effect: Loading initial data...");
      try {
        const allLanguages = await fetchLanguages();
        setLanguages(allLanguages);
        console.log("Fetched languages:", allLanguages);

        if (initialData) {
          console.log("Mode: EDIT. Loading form data...");

          const module = await fetchModuleById(initialData.moduleId);
          console.log("Fetched module:", module);

          const course = await getCourseById(module.courseId);
          console.log("Fetched course:", course);

          let initialLanguage: Language | undefined;
          // ✅ Fix TS2367 error: Assign to a new variable to narrow the type
          if (typeof course.language === 'string') {
            const langName = course.language; // Create a new variable with string type
            initialLanguage = allLanguages.find(lang => lang.name === langName);
          } else {
            initialLanguage = allLanguages.find(lang => lang.id === course.language.id);
          }

          if (initialLanguage) {
            console.log("Found initial language:", initialLanguage);
            // ✅ Set the Language object in state
            setSelectedLanguage(initialLanguage);

            const coursesByLang = await getCoursesByLanguage(initialLanguage.id);
            setCourses(coursesByLang);
            console.log("Fetched courses by language:", coursesByLang);

            setSelectedCourseId(course.id);

            const modulesByCourse = await fetchModules(course.id);
            setModules(modulesByCourse);
            console.log("Fetched modules by course:", modulesByCourse);

            // Set final form data
            setFormData({
              name: initialData.name || '',
              description: initialData.description || '',
              type: initialData.type,
              moduleId: initialData.moduleId,
              status: initialData.status,
              content: initialData.content || '',
              videoUrl: initialData.videoUrl || '',
              duration: initialData.duration || '',
            });
            console.log("Initial form data set:", initialData);
          } else {
            console.warn('Could not find the language corresponding to the initial data.');
            toast.warn('Không tìm thấy ngôn ngữ tương ứng với dữ liệu ban đầu.');
          }

        } else {
          console.log("Mode: CREATE. Language list loaded.");
        }
      } catch (error) {
        toast.error('Error loading initial data');
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
        console.log("Loading complete.");
      }
    };
    loadData();
  }, [initialData]);

  // ✅ Effect 2: Update courses when selectedLanguage changes
  useEffect(() => {
    // ✅ Use a temporary variable to check if this is the first interaction after mount
    const isFirstInteraction = isInitialMount.current;

    // Set isInitialMount to false after the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const loadCourses = async () => {
      // ✅ Only run reset logic if it's NOT the initial interaction
      if (!isFirstInteraction) {
        setCourses([]);
        setSelectedCourseId(undefined);
        setModules([]);
        setFormData(prev => ({ ...prev, moduleId: 0 }));
      }

      if (selectedLanguage === undefined) {
        return;
      }
      console.log("User action: Language changed to", selectedLanguage.name);
      try {
        const fetchedCourses = await getCoursesByLanguage(selectedLanguage.id);
        setCourses(fetchedCourses);
      } catch (error) {
        toast.error('Không tải được danh sách khóa học');
        console.error("Error loading courses:", error);
      }
    };
    loadCourses();
  }, [selectedLanguage]);

  // ✅ Effect 3: Update modules when course changes
  useEffect(() => {
    // ✅ Use a temporary variable to check if this is the first interaction after mount
    const isFirstInteraction = isInitialMount.current;

    const loadModules = async () => {
      // ✅ Only run reset logic if it's NOT the initial interaction
      if (!isFirstInteraction) {
        setModules([]);
        setFormData(prev => ({ ...prev, moduleId: 0 }));
      }

      if (selectedCourseId === undefined) {
        return;
      }
      console.log("User action: Course changed to", selectedCourseId);
      try {
        const fetchedModules = await fetchModules(selectedCourseId);
        setModules(fetchedModules);
      } catch (error) {
        toast.error('Không tải được danh sách module');
        console.error("Error loading modules:", error);
      }
    };
    loadModules();
  }, [selectedCourseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.moduleId) {
      toast.warn('Vui lòng chọn một module.');
      return;
    }
    await onSubmit(formData);
  };

  const handleUploadFile = async (file: File, type: 'video' | 'document') => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await api.post('/api/uploads', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data.url;

      if (type === 'video') {
        setFormData(fd => ({ ...fd, videoUrl: fileUrl, content: '' }));
        toast.success('Upload video thành công!');
      } else {
        setFormData(fd => ({ ...fd, content: fileUrl, videoUrl: '' }));
        toast.success('Upload tài liệu thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      toast.error('Upload thất bại.');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'document') => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0], type);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Part Title</Label>
            <Input_admin
                value={formData.name}
                onChange={e => setFormData(fd => ({ ...fd, name: e.target.value }))}
                required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
                value={formData.type}
                onValueChange={(v: 'video' | 'document') =>
                    setFormData(fd => ({ ...fd, type: v, videoUrl: '', content: '' }))
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Video URL/Document and Duration */}
        {formData.type === 'video' ? (
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="flex items-center gap-2">
                <Input_admin
                    value={formData.videoUrl || ''}
                    onChange={e => setFormData(fd => ({ ...fd, videoUrl: e.target.value }))}
                    placeholder="Paste YouTube or other video URL here"
                />
                <Label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                  Upload Video
                  <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => onFileChange(e, 'video')}
                  />
                </Label>
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
                    rows={4}
                />
                <Label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                  Upload Document
                  <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt,.md"
                      onChange={(e) => onFileChange(e, 'document')}
                  />
                </Label>
              </div>
            </div>
        )}

        {/* Duration */}
        <div className="space-y-2">
          <Label>Duration (e.g., 5:30 for 5 minutes 30 seconds)</Label>
          <Input_admin
              value={formData.duration || ''}
              onChange={e => setFormData(fd => ({ ...fd, duration: e.target.value }))}
              placeholder="e.g., 5:30"
          />
        </div>

        {/* Language, Course & Module */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
                // ✅ Use selectedLanguage instead of selectedLanguageId
                value={selectedLanguage ? String(selectedLanguage.id) : ''}
                onValueChange={v => {
                  const newLanguage = languages.find(lang => lang.id === Number(v));
                  if (newLanguage) {
                    setSelectedLanguage(newLanguage);
                  }
                }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(l => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {/*{l.name}*/}
                      <div className="flex items-center gap-2">
                        <img src={l.flag} alt={l.code} className="w-4 h-3 rounded-sm" />
                        {l.name}
                      </div>
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Course</Label>
            <Select
                value={selectedCourseId ? String(selectedCourseId) : ''}
                onValueChange={v => setSelectedCourseId(Number(v))}
                disabled={!selectedLanguage || courses.length === 0}
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
                onValueChange={v => setFormData(fd => ({ ...fd, moduleId: Number(v) }))}
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

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
              value={formData.description || ''}
              onChange={e => setFormData(fd => ({ ...fd, description: e.target.value }))}
              placeholder="Mô tả bài học"
              rows={3}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button_admin className="bg-gradient-to-r from-green-500 to-emerald-500" type="submit" disabled={loading}>
            {initialData ? 'Update Part' : 'Create New Part'}
          </Button_admin>
        </div>
      </form>
  );
};

export default PartForm;
