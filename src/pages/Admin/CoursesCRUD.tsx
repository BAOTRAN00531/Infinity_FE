import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import CourseForm from '@/components/inmutable-components/CRUD/form/CourseForm';
import CourseDetails from '@/components/inmutable-components/CRUD/detail/CourseDetails';
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { ArrowUpDown } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  description: string;
  language: { id: number; name: string };
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'inactive';
  createdAt: string;
  modulesCount: number;
}

const CoursesCRUD = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const res = await axios.get('http://localhost:8080/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch {

      toast.error('Failed to fetch courses');
    }
  };

  const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };

  const filteredCourses = courses
    .filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'level-asc':
          return levelOrder[a.level] - levelOrder[b.level];
        case 'level-desc':
          return levelOrder[b.level] - levelOrder[a.level];
        default:
          return 0;
      }
    });

  const handleCreate = async (courseData: Omit<Course, 'id' | 'createdAt' | 'modulesCount'>) => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.post('http://localhost:8080/api/courses', courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course created');
      setIsCreateOpen(false);
      fetchCourses();
    } catch {
      toast.error('Failed to create course');
    }
  };

  const handleUpdate = async (courseData: Omit<Course, 'id' | 'createdAt' | 'modulesCount'>) => {
    if (!selectedCourse) return;
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.put(`http://localhost:8080/api/courses/${selectedCourse.id}`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course updated');
      setIsEditOpen(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch {
      toast.error('Failed to update course');
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      await axios.delete(`http://localhost:8080/api/courses/${selectedCourse.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Course deleted');
      setIsDeleteOpen(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Courses Management</h2>
              <p className="text-gray-600">Create and manage learning courses</p>
            </div>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button_admin className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-md hover:shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button_admin>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[hsl(var(--foreground))] dark:text-[hsl(var(--primary))] drop-shadow-md ">Create New Course</DialogTitle>
              </DialogHeader>
              <CourseForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input_admin
              placeholder="Search by title, language or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md rounded-2xl"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[280px] rounded-2xl border-2 border-gray-200 focus:border-blue-400">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="title-asc">Title: A-Z</SelectItem>
              <SelectItem value="title-desc">Title: Z-A</SelectItem>
              <SelectItem value="level-asc">Level: Beginner → Advanced</SelectItem>
              <SelectItem value="level-desc">Level: Advanced → Beginner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl p-6 shadow-md">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--primary))] drop-shadow-md">{course.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                </div>

                <div className="text-sm space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--primary))] drop-shadow-md ">{course.language.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <Badge className={`rounded-full text-xs ${getLevelColor(course.level)}`}>{course.level}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Modules:</span>
                    <span>{course.modulesCount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <Badge className={`text-xs rounded-full ${
                      course.status === 'active'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {course.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button_admin variant="ghost" size="sm" onClick={() => { setSelectedCourse(course); setIsViewOpen(true); }}>
                      <Eye className="w-4 h-4" />
                    </Button_admin>
                    <Button_admin variant="ghost" size="sm" onClick={() => { setSelectedCourse(course); setIsEditOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button_admin>
                    <Button_admin variant="ghost" size="sm" onClick={() => { setSelectedCourse(course); setIsDeleteOpen(true); }} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button_admin>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
                <CourseForm initialData={selectedCourse} onSubmit={handleUpdate} />
            )}
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Course Details</DialogTitle>
            </DialogHeader>
            {selectedCourse && <CourseDetails course={selectedCourse} />}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
                <DeleteConfirmation
                    userName={selectedCourse.name}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default CoursesCRUD;
