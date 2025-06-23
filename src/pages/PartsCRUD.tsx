
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input } from '@/components/reusable-components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import PartForm from '@/components/inmutable-components/CRUD/form/PartForm';
import PartDetails from '@/components/inmutable-components/CRUD/detail/PartDetails';
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation';

interface Part {
  id: number;
  title: string;
  type: 'video' | 'exercise';
  moduleId: number;
  moduleName: string;
  order: number;
  duration: string;
  status: 'active' | 'inactive';
}

const PartsCRUD = () => {
  const [parts, setParts] = useState<Part[]>([
    { id: 1, title: 'Introduction to Greetings', type: 'video', moduleId: 1, moduleName: 'Basic Greetings', order: 1, duration: '5 min', status: 'active' },
    { id: 2, title: 'Common Phrases Practice', type: 'exercise', moduleId: 1, moduleName: 'Basic Greetings', order: 2, duration: '10 min', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredParts = parts.filter(part =>
    part.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (partData: Omit<Part, 'id'>) => {
    const newPart = {
      ...partData,
      id: Math.max(...parts.map(p => p.id)) + 1,
    };
    setParts([...parts, newPart]);
    setIsCreateOpen(false);
  };

  const handleUpdate = (partData: Omit<Part, 'id'>) => {
    if (selectedPart) {
      setParts(parts.map(part => 
        part.id === selectedPart.id 
          ? { ...partData, id: selectedPart.id }
          : part
      ));
      setIsEditOpen(false);
      setSelectedPart(null);
    }
  };

  const handleDelete = () => {
    if (selectedPart) {
      setParts(parts.filter(part => part.id !== selectedPart.id));
      setIsDeleteOpen(false);
      setSelectedPart(null);
    }
  };

  return (
    <div className="p-8">
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
            <Button_admin className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Add Part
            </Button_admin>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-[hsl(var(--foreground))] dark:text-[hsl(var(--primary))] drop-shadow-md">Create New Part</DialogTitle>
            </DialogHeader>
            <PartForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search parts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-green-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                #{part.order}
              </span>
              <Badge className="text-xs bg-blue-100 text-blue-800">
                {part.type}
              </Badge>
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">{part.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{part.moduleName}</p>
            
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-600">{part.duration}</span>
              <Badge className={`text-xs font-bold rounded-full ${
                part.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {part.status}
              </Badge>
            </div>

            <div className="flex justify-end gap-2">
              <Button_admin
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-blue-100"
                onClick={() => {
                  setSelectedPart(part);
                  setIsViewOpen(true);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button_admin>
              <Button_admin
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-yellow-100"
                onClick={() => {
                  setSelectedPart(part);
                  setIsEditOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button_admin>
              <Button_admin
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-red-100 text-red-500"
                onClick={() => {
                  setSelectedPart(part);
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button_admin>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">Edit Part</DialogTitle>
          </DialogHeader>
          {selectedPart && (
            <PartForm
              initialData={selectedPart}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">Part Details</DialogTitle>
          </DialogHeader>
          {selectedPart && <PartDetails part={selectedPart} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">Delete Part</DialogTitle>
          </DialogHeader>
          {selectedPart && (
            <DeleteConfirmation
              userName={selectedPart.title}
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartsCRUD;
