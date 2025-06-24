
import React, { useState } from 'react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Label } from '@/components/reusable-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';

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

interface PartFormProps {
  initialData?: Part;
  onSubmit: (data: Omit<Part, 'id'>) => void;
}

const PartForm = ({ initialData, onSubmit }: PartFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'video' as const,
    moduleId: initialData?.moduleId || 1,
    moduleName: initialData?.moduleName || 'Basic Greetings',
    order: initialData?.order || 1,
    duration: initialData?.duration || '',
    status: initialData?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Part Title</Label>
          <Input_admin
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="rounded-2xl border-2 border-gray-200 focus:border-green-400"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Type</Label>
          <Select value={formData.type} onValueChange={(value: 'video' | 'exercise') => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="exercise">Exercise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Module</Label>
        <Select value={formData.moduleName} onValueChange={(value: string) => setFormData({ ...formData, moduleName: value })}>
          <SelectTrigger className="rounded-2xl border-2 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="Basic Greetings">Basic Greetings</SelectItem>
            <SelectItem value="Numbers and Counting">Numbers and Counting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Order</Label>
          <Input_admin
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="rounded-2xl border-2 border-gray-200 focus:border-green-400"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Duration</Label>
          <Input_admin
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 5 min"
            className="rounded-2xl border-2 border-gray-200 focus:border-green-400"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700 dark:text-gray-200">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
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

      <div className="flex justify-end space-x-4 pt-6">
        <Button_admin
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {initialData ? 'Update Part' : 'Create Part'}
        </Button_admin>
      </div>
    </form>
  );
};

export default PartForm;
