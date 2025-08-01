// src/pages/PartsCRUD.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { Button_admin } from '@/components/reusable-components/button_admin'
import { Input } from '@/components/reusable-components/input'
import {Dialog,DialogContent,DialogHeader,DialogTitle,
DialogTrigger,} from '@/components/reusable-components/dialog'
import { Badge } from '@/components/reusable-components/badge'
import PartForm, { Part } from '@/components/inmutable-components/CRUD/form/PartForm'
import PartDetails from '@/components/inmutable-components/CRUD/detail/PartDetails'
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation'

const PartsCRUD: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([])
  const [modules, setModules] = useState<{ id: number; name: string }[]>([])
  // Bỏ moduleFilter
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Fetch modules lần đầu (nếu cần cho form), không cần setModuleFilter
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (!token) throw new Error('Chưa đăng nhập')
        const res = await axios.get<{ id: number; name: string }[]>(
            'http://localhost:8080/api/modules',
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setModules(res.data)
      } catch (err) {
        console.error(err)
        toast.error('Không tải được Modules', {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      }
    }
    fetchModules()
  }, [])

  // Hàm fetch lại parts (luôn fetch toàn bộ)
  const fetchParts = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('Chưa đăng nhập')
      const res = await axios.get<Part[]>(
          'http://localhost:8080/api/lessons',
          { headers: { Authorization: `Bearer ${token}` } }
      )
      setParts(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Không tải được Parts', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
    }
  }

  useEffect(() => {
    fetchParts()
  }, [])

  // Create mới lên API
  const handleCreate = async (data: Omit<Part, 'id'>) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('Chưa đăng nhập')
      console.log('Data gửi lên:', data)
      await axios.post(
          'http://localhost:8080/api/lessons',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Tạo Part thành công', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
      setIsCreateOpen(false)
      await fetchParts()
    } catch (err) {
      console.error(err)
      toast.error('Tạo Part thất bại', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
    }
  }

  // Update lên API
  const handleUpdate = async (data: Omit<Part, 'id'>) => {
    if (!selectedPart) return
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('Chưa đăng nhập')
      await axios.put(
          `http://localhost:8080/api/lessons/${selectedPart.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Cập nhật Part thành công', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
      setIsEditOpen(false)
      setSelectedPart(null)
      await fetchParts()
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật Part thất bại', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
    }
  }

  // Xóa lên API
  const handleDelete = async () => {
    if (!selectedPart) return
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('Chưa đăng nhập')
      await axios.delete(
          `http://localhost:8080/api/lessons/${selectedPart.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Xóa Part thành công', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
      setIsDeleteOpen(false)
      setSelectedPart(null)
      await fetchParts()
    } catch (err) {
      console.error(err)
      toast.error('Xóa Part thất bại', {
        autoClose: 1200, // 👈 1.2 giây riêng lẻ
      });
    }
  }

  // Filter + sort
  const normalizedTerm = searchTerm.toLowerCase();
  const filtered = parts
    .filter(p => {
      const name = p.name ?? '';
      const moduleName = p.moduleName ?? '';
      return (
        name.toLowerCase().includes(normalizedTerm) ||
        moduleName.toLowerCase().includes(normalizedTerm)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'active':
          return (a.status === 'active' ? -1 : 1) - (b.status === 'active' ? -1 : 1);
        case 'inactive':
          return (a.status === 'inactive' ? -1 : 1) - (b.status === 'inactive' ? -1 : 1);
        default:
          return 0;
      }
    });

  return (
      <div className="p-8">
        {/* Header + Create button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Parts Management</h2>
              <p className="text-gray-600">Create individual learning parts</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button_admin className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Plus className="w-5 h-5 mr-2" />
                Create New Part
              </Button_admin>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle>Create New Part</DialogTitle>
              </DialogHeader>
              <PartForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Sort dưới tiêu đề */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
              placeholder="Search parts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-md rounded-2xl"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-2xl border-2 border-gray-200 focus:border-blue-400 px-4 py-2"
          >
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
            <option value="active">Active First</option>
            <option value="inactive">Inactive First</option>
          </select>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(part => (
              <div
                  key={part.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  {/* Đã xoá orderIndex */}
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {part.type}
                  </Badge>
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">
                  {part.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{part.moduleName}</p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <Badge
                      className={`text-xs font-bold rounded-full ${
                          part.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {part.status}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2">
                  <Button_admin
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPart(part)
                        setIsViewOpen(true)
                      }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button_admin>
                  <Button_admin
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPart(part)
                        setIsEditOpen(true)
                      }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button_admin>
                  <Button_admin
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPart(part)
                        setIsDeleteOpen(true)
                      }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button_admin>
                </div>
              </div>
          ))}
        </div>

        {/* Edit, View, Delete dialogs */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Edit Part</DialogTitle>
            </DialogHeader>
            {selectedPart && (
                <PartForm initialData={selectedPart} onSubmit={handleUpdate} />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Part Details</DialogTitle>
            </DialogHeader>
            {selectedPart && <PartDetails part={selectedPart} />}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle>Delete Part</DialogTitle>
            </DialogHeader>
            {selectedPart && (
                <DeleteConfirmation
                    userName={selectedPart.name}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}

export default PartsCRUD
