import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, Layers, ArrowUpDown } from 'lucide-react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { Badge } from '@/components/reusable-components/badge';
import ModuleForm from '../../components/inmutable-components/CRUD/form/ModuleForm';
import ModuleDetails from '../../components/inmutable-components/CRUD/detail/ModuleDetails';
import DeleteConfirmation from '../../components/inmutable-components/DeleteConfirmation';
import { toast } from 'react-toastify';
import { ModuleRequest } from '../../components/inmutable-components/CRUD/form/ModuleForm'; // hoặc wherever bạn định nghĩa

interface Module {
  id: number;
  name: string;
  description: string;
  courseId: number;
  courseName: string;
  order: number;
  duration: string;
  status: 'active' | 'inactive';
  partsCount: number;
}

const ModulesCRUD = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8080/api/modules', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setModules(res.data);
      } catch (err) {
        toast.error('Failed to load modules');
      }
    };
    fetchModules();
  }, []);

  const filteredModules = modules
  .filter(module =>
      (module.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (module.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  )
  .sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.name.localeCompare(b.name);
      case 'title-desc':
        return b.name.localeCompare(a.name);
      case 'status-asc':
        return a.status.localeCompare(b.status);
      case 'status-desc':
        return b.status.localeCompare(a.status);
      case 'parts-asc':
        return a.partsCount - b.partsCount;
      case 'parts-desc':
        return b.partsCount - a.partsCount;
      case 'duration-asc':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'duration-desc':
        return parseInt(b.duration) - parseInt(a.duration);
      default:
        return 0;
    }
  })
  ;


  const handleCreate = async (moduleData: ModuleRequest) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('No token');

      const res = await axios.post('http://localhost:8080/api/modules', moduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModules((prev) => [...prev, res.data]);
      setIsCreateOpen(false);
      toast.success('Module created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create module');
    }
  };

  const handleUpdate = async (moduleData: ModuleRequest) => {
    if (!selectedModule) return;

    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) throw new Error('No token');

      const res = await axios.put(
          `http://localhost:8080/api/modules/${selectedModule.id}`,
          moduleData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      setModules((prev) =>
          prev.map((m) => (m.id === selectedModule.id ? res.data : m))
      );

      setIsEditOpen(false);
      setSelectedModule(null);
      toast.success('Module updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update module');
    }
  };


  const handleDelete = async () => {
    if (!selectedModule) return;
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.delete(`http://localhost:8080/api/modules/${selectedModule.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(modules.filter((m) => m.id !== selectedModule.id));
      setIsDeleteOpen(false);
      setSelectedModule(null);
      toast.success('Module deleted');
    } catch (error) {
      toast.error('Failed to delete module');
    }
  };

  return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Modules Management</h2>
              <p className="text-gray-600">Organize course content into modules</p>
            </div>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button_admin className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Add Module
              </Button_admin>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[hsl(var(--foreground))] dark:text-[hsl(var(--primary))] drop-shadow-md">Create New Module</DialogTitle>
              </DialogHeader>
              <ModuleForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input_admin
              placeholder="Search modules by title or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[280px] rounded-2xl border-2 border-gray-200 focus:border-blue-400">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="title-asc">Title: A-Z</SelectItem>
            <SelectItem value="title-desc">Title: Z-A</SelectItem>
            <SelectItem value="status-asc">Status: Active First</SelectItem>
            <SelectItem value="status-desc">Status: Inactive First</SelectItem>
            <SelectItem value="parts-asc">Parts: Low to High</SelectItem>
            <SelectItem value="parts-desc">Parts: High to Low</SelectItem>
            <SelectItem value="duration-asc">Duration: Short to Long</SelectItem>
            <SelectItem value="duration-desc">Duration: Long to Short</SelectItem>
          </SelectContent>
        </Select>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
              <div
                  key={module.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    #{module.order}
                  </span>
                      <span className="text-xs text-gray-500">{module.courseName}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">{module.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{module.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <span className="text-sm font-bold ">{module.duration}</span>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Parts:</span>
                    <span className="text-sm font-bold ">{module.partsCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Badge className={`text-xs font-bold rounded-full ${
                      module.status === 'active'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100  border-gray-200'
                  }`}>
                    {module.status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button_admin
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModule(module);
                          setIsViewOpen(true);
                        }}
                        className="rounded-xl hover:bg-blue-100"
                    >
                      <Eye className="w-4 h-4" />
                    </Button_admin>
                    <Button_admin
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModule(module);
                          setIsEditOpen(true);
                        }}
                        className="rounded-xl hover:bg-yellow-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button_admin>
                    <Button_admin
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModule(module);
                          setIsDeleteOpen(true);
                        }}
                        className="rounded-xl hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button_admin>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Dialogs */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black ">Edit Module</DialogTitle>
            </DialogHeader>
            {selectedModule && (
                <ModuleForm
                    initialData={selectedModule}
                    onSubmit={handleUpdate}
                />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black ">Module Details</DialogTitle>
            </DialogHeader>
            {selectedModule && <ModuleDetails module={selectedModule} />}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black ">Delete Module</DialogTitle>
            </DialogHeader>
            {selectedModule && (
                <DeleteConfirmation
                    userName={selectedModule.name}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ModulesCRUD;
