// src/components/inmutable-components/CRUD/form/PartForm.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button_admin } from '@/components/reusable-components/button_admin'
import { Input_admin } from '@/components/reusable-components/input_admin'
import { Label } from '@/components/reusable-components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/reusable-components/select'

interface Module {
  id: number
  name: string
  courseId: number // Thêm trường này để fix lỗi linter
}

interface Course {
  id: number
  name: string
}

interface Language {
  id: number;
  name: string;
}

export interface Part {
  id: number
  name: string
  type: 'video' | 'exercise'
  moduleId: number
  moduleName: string
  status: 'active' | 'inactive'
}

interface PartFormProps {
  initialData?: Part
  onSubmit: (data: Omit<Part, 'id'>) => Promise<void>
}

const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(initialData ? 0 : 0)
  const [formData, setFormData] = useState<Omit<Part, 'id'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'video',
    moduleId: initialData?.moduleId || 0,
    moduleName: initialData?.moduleName || '',
    status: initialData?.status || 'active',
  })

  // Fetch languages khi mở form
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('No token')
        const res = await axios.get<Language[]>(
          'http://localhost:8080/api/languages',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setLanguages(res.data)
        if (!initialData && res.data.length > 0) {
          setSelectedLanguageId(res.data[0].id)
        }
      } catch {
        toast.error('Không tải được danh sách ngôn ngữ', {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      }
    }
    fetchLanguages()
  }, [initialData])

  // Fetch courses khi chọn ngôn ngữ
  useEffect(() => {
    if (!selectedLanguageId) return;
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('No token')
        const res = await axios.get<Course[]>(
          `http://localhost:8080/api/courses/by-language/${selectedLanguageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setCourses(res.data)
        if (!initialData && res.data.length > 0) {
          setSelectedCourseId(res.data[0].id)
        }
      } catch {
        toast.error('Không tải được danh sách courses', {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      }
    }
    fetchCourses()
  }, [selectedLanguageId, initialData])

  // Fetch modules khi chọn course
  useEffect(() => {
    if (!selectedCourseId) return
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('No token')
        const res = await axios.get<Module[]>(
          `http://localhost:8080/api/modules?courseId=${selectedCourseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setModules(res.data)
        // Nếu tạo mới, chọn module đầu tiên
        if (!initialData && res.data.length > 0) {
          setFormData(fd => ({
            ...fd,
            moduleId: res.data[0].id,
            moduleName: res.data[0].name,
          }))
        }
      } catch {
        toast.error('Không tải được danh sách modules', {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      }
    }
    fetchModules()
  }, [selectedCourseId, initialData])

  // Nếu initialData thay đổi (khi edit), set lại toàn bộ formData và selectedCourseId
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        moduleId: initialData.moduleId,
        moduleName: initialData.moduleName,
        status: initialData.status,
      })
      // Tìm courseId từ moduleId (nếu có thể)
      const fetchCourseIdByModule = async () => {
        try {
          const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
          if (!token) throw new Error('No token')
          const res = await axios.get<Module>(
            `http://localhost:8080/api/modules/${initialData.moduleId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          // Giả sử module có trường courseId
          setSelectedCourseId(res.data.courseId)
        } catch {}
      }
      fetchCourseIdByModule()
    }
  }, [initialData])

  const fetchMaxOrder = async (moduleId: number) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No token')
      const res = await axios.get<{ maxOrder: number }>(
          `http://localhost:8080/api/lessons/max-order`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { moduleId },
          }
      )
      return res.data.maxOrder + 1
    } catch {
      toast.error('Không lấy được order index', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
      return 1
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

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
                onValueChange={(v: 'video' | 'exercise') =>
                    setFormData(fd => ({ ...fd, type: v }))
                }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Language, Course & Module */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                setSelectedCourseId(Number(v))
                setModules([])
                setFormData(fd => ({ ...fd, moduleId: 0, moduleName: '' }))
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
                const m = modules.find(x => x.id === Number(v))
                if (m) {
                  setFormData(fd => ({
                    ...fd,
                    moduleId: m.id,
                    moduleName: m.name,
                  }))
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
  )
}

export default PartForm
