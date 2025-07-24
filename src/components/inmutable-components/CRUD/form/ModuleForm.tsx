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
interface Course {
  id: number
  name: string
  status?: 'active' | 'inactive'; // Thêm status vào interface để filter
}

/** Kiểu dữ liệu form truyền lên BE (mapping sang DTO) */
export interface Module {
  id: number
  name: string
  description: string
  courseId: number
  courseName: string
  order: number
  duration: string
  status: 'active' | 'inactive'
  partsCount: number
}

export interface ModuleRequest {
  name: string;
  description: string;
  courseId: number;
  order: number;
  duration: string;
  status: 'active' | 'inactive';
}


/** Props mà ModulesCRUD truyền vào */
interface ModuleFormProps {
  initialData?: Module;
  onSubmit: (data: ModuleRequest) => Promise<void>;
}


const ModuleForm: React.FC<ModuleFormProps> = ({ initialData, onSubmit }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState<Omit<Module, 'id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    courseId: initialData?.courseId || 0,
    courseName: initialData?.courseName || 'Select a course',
    order: initialData?.order || 1,
    duration: initialData?.duration || '',
    status: initialData?.status || 'active',
    partsCount: initialData?.partsCount || 0,
  })

  // Fetch courses vào dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('No token')
        const res = await axios.get<Course[]>(
            'http://localhost:8080/api/courses',
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setCourses(res.data)
        // nếu edit thì map lại courseName
        if (initialData) {
          const found = res.data.find(c => c.id === initialData.courseId)
          if (found) {
            setFormData(fd => ({ ...fd, courseName: found.name }))
          }
        }
      } catch (err) {
        console.error(err)
        toast.error('Không tải được danh sách courses')
      }
    }
    fetchCourses()
  }, [initialData])

  // Đồng bộ lại khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        courseId: initialData.courseId,
        courseName: initialData.courseName,
        order: initialData.order,
        duration: initialData.duration,
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
      duration: formData.duration,
      status: formData.status,
    };

    await onSubmit(payload);
  };



  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Module Title
            </Label>
            <Input_admin
                value={formData.name}
                onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Course
            </Label>

            <Select
                value={formData.courseId ? formData.courseId.toString() : undefined}
                onValueChange={(value) => {
                  const id = parseInt(value, 10);
                  const found = courses.find(c => c.id === id);
                  setFormData({
                    ...formData,
                    courseId: id,
                    courseName: found?.name || '',
                  });
                }}
            >
              <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                <SelectValue placeholder="Chọn một khóa học" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl">
                {courses.filter(course => course.status === 'active').map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
            Description
          </Label>
          <Textarea
              value={formData.description}
              onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
              }
              className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
              required
          />
        </div>

        {/* Order / Duration / Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order */}
          <div className="space-y-2">
          </div>
          {/* Duration */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Duration
            </Label>
            <Input_admin
                value={formData.duration}
                onChange={e =>
                    setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 2 hours"
                className="rounded-2xl border-2 border-gray-200 focus:border-blue-400"
                required
            />
          </div> */}
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Status
            </Label>
            <Select
                value={formData.status}
                onValueChange={value =>
                    setFormData({ ...formData, status: value as 'active' | 'inactive' })
                }
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
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                     text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl
                     transition-all duration-300 disabled:opacity-50"
          >
            {initialData ? 'Update Module' : 'Create Module'}
          </Button_admin>
        </div>
      </form>
  )
}

export default ModuleForm
