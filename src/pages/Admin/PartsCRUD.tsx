import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { Button_admin } from '@/components/reusable-components/button_admin'
import { Input } from '@/components/reusable-components/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog'
import { Badge } from '@/components/reusable-components/badge'
import PartForm from '@/components/inmutable-components/CRUD/form/PartForm'
import PartDetails from '@/components/inmutable-components/CRUD/detail/PartDetails'
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation'
import {
  fetchParts,
  createPart,
  updatePart,
  deletePart,
} from '@/api/part.service'
import {Part} from "@/types";

const PartsCRUD: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Fetch toàn bộ parts
  const loadParts = async () => {
    try {
      const allParts = await fetchParts()
      setParts(allParts)
    } catch (err) {
      console.error(err)
      toast.error('Không tải được Parts', { autoClose: 1200 })
    }
  }

  useEffect(() => {
    loadParts()
  }, [])

  // Create mới
  const handleCreate = async (data: any) => {
    try {
      await createPart(data)
      toast.success('Tạo Part thành công', { autoClose: 1200 })
      setIsCreateOpen(false)
      loadParts()
    } catch (err) {
      console.error(err)
      toast.error('Tạo Part thất bại', { autoClose: 1200 })
    }
  }

  // Update
  const handleUpdate = async (data: any) => {
    if (!selectedPart) return
    try {
      await updatePart(selectedPart.id, data)
      toast.success('Cập nhật Part thành công', { autoClose: 1200 })
      setIsEditOpen(false)
      setSelectedPart(null)
      loadParts()
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật Part thất bại', { autoClose: 1200 })
    }
  }

  // Delete
  const handleDelete = async () => {
    if (!selectedPart) return
    try {
      await deletePart(selectedPart.id)
      toast.success('Xóa Part thành công', { autoClose: 1200 })
      setIsDeleteOpen(false)
      setSelectedPart(null)
      loadParts()
    } catch (err) {
      console.error(err)
      toast.error('Xóa Part thất bại', { autoClose: 1200 })
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
            <DialogContent className="max-w-3xl rounded-3xl max-h-[80vh] overflow-y-scroll">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black ">Create New Part</DialogTitle>
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
          <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black ">Edit Part</DialogTitle>
            </DialogHeader>
            {selectedPart && (
                <PartForm initialData={selectedPart} onSubmit={handleUpdate} />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-y-scroll">
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
