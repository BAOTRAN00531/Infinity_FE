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
  title: string
}

export interface Part {
  id: number
  name: string
  type: 'video' | 'exercise'
  moduleId: number
  moduleName: string
  order: number
  duration: string
  status: 'active' | 'inactive'
}

interface PartFormProps {
  initialData?: Part
  onSubmit: (data: Omit<Part, 'id'>) => Promise<void>
}

const PartForm: React.FC<PartFormProps> = ({ initialData, onSubmit }) => {
  const [modules, setModules] = useState<Module[]>([])
  const [formData, setFormData] = useState<Omit<Part, 'id'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'video',
    moduleId: initialData?.moduleId || 0,
    moduleName: initialData?.moduleName || '',
    order: initialData?.order || 1,
    duration: initialData?.duration || '',
    status: initialData?.status || 'active',
  })

  // Load modules và set moduleName cho lần đầu
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No token')
        const res = await axios.get<Module[]>(
            'http://localhost:8080/api/modules',
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setModules(res.data)

        if (!initialData && res.data.length > 0) {
          // lần đầu tạo mới, chọn module đầu tiên
          setFormData(fd => ({
            ...fd,
            moduleId: res.data[0].id,
            moduleName: res.data[0].title,
          }))
        } else if (initialData) {
          // khi edit, cập nhật moduleName theo initialData
          const m = res.data.find(m => m.id === initialData.moduleId)
          if (m) {
            setFormData(fd => ({
              ...fd,
              moduleName: m.title,
            }))
          }
        }
      } catch {
        toast.error('Không tải được danh sách modules')
      }
    }
    fetchModules()
  }, [initialData])

  // Nếu initialData thay đổi (khi edit), set lại toàn bộ formData
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        moduleId: initialData.moduleId,
        moduleName: initialData.moduleName,
        order: initialData.order,
        duration: initialData.duration,
        status: initialData.status,
      })
    }
  }, [initialData])

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

        {/* Module */}
        <div className="space-y-2">
          <Label>Module</Label>
          <Select
              value={String(formData.moduleId)}
              onValueChange={v => {
                const m = modules.find(x => x.id === Number(v))
                if (m) {
                  setFormData(fd => ({
                    ...fd,
                    moduleId: m.id,
                    moduleName: m.title,
                  }))
                }
              }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map(m => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.title}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Order, Duration, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Order</Label>
            <Input_admin
                type="number"
                value={formData.order}
                onChange={e =>
                    setFormData(fd => ({ ...fd, order: +e.target.value }))
                }
                required
            />
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input_admin
                value={formData.duration}
                onChange={e =>
                    setFormData(fd => ({ ...fd, duration: e.target.value }))
                }
                placeholder="e.g., 5 min"
                required
            />
          </div>
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
