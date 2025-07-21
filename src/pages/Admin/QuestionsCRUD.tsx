// file QuestionsCRUD.tsx

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, HelpCircle } from 'lucide-react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input } from '@/components/reusable-components/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import QuestionForm from '@/components/inmutable-components/CRUD/form/QuestionForm';
import QuestionDetails from '@/components/inmutable-components/CRUD/detail/QuestionDetails';
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation';
import {
  fetchModules,
  fetchLessonsByModule,
  fetchQuestionsByLesson,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '@/api/adminQuestionApi';
import {Module, Lesson, UIQuestion, QUESTION_TYPE_MAP} from '@/types';
import {
  mapUIQuestionToCreateDto,
  mapUIQuestionToUpdateDto,
  mapQuestionResponseToUIQuestion,
} from '@/utils';
import QuestionsList from "@/pages/Admin/QuestionsList";
import { toast } from 'react-toastify';

export const QUESTION_TYPE_DESCRIPTION_TO_ID: Record<string, number> = Object.entries(QUESTION_TYPE_MAP)
    .reduce((acc, [id, desc]) => {
      acc[desc] = parseInt(id);
      return acc;
    }, {} as Record<string, number>);


const QuestionsCRUD = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UIQuestion | null>(null);

  useEffect(() => {
    fetchModules()
        .then(setModules)
        .catch(() => toast.error('Không thể tải modules'));
  }, []);


  const handleModuleSelect = async (moduleId: number) => {
    try {
      const lessons = await fetchLessonsByModule(moduleId);
      setLessons(lessons);
      setSelectedModule(moduleId);
      setSelectedLesson(null); // ✅ Reset lesson
      setQuestions([]); // ✅ Clear old questions nếu cần
    } catch (err) {
      toast.error("Không thể tải danh sách bài học");
    }
  };



  const handleLessonSelect = async (lessonId: number) => {
    setSelectedLesson(lessonId);
    const qs = await fetchQuestionsByLesson(lessonId);
    const mapped = qs.map(mapQuestionResponseToUIQuestion);
    setQuestions(mapped);
  };


  const handleCreate = async (question: UIQuestion) => {
    await createQuestion(question);

    if (selectedLesson) {
      const updated = await fetchQuestionsByLesson(selectedLesson);
      const mapped = updated.map(mapQuestionResponseToUIQuestion);
      setQuestions(mapped);
    }

    setIsCreateOpen(false);
  };



  const handleUpdate = async (question: UIQuestion) => {
    if (!question.id) return;
    await updateQuestion(question.id, question);
    if (selectedLesson) {
      const updated = await fetchQuestionsByLesson(selectedLesson);
      const mapped = updated.map(mapQuestionResponseToUIQuestion);
      setQuestions(mapped);
    }
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedQuestion?.id) return;
    await deleteQuestion(selectedQuestion.id);
    if (selectedLesson) {
      const updated = await fetchQuestionsByLesson(selectedLesson);
      const mapped = updated.map(mapQuestionResponseToUIQuestion);
      setQuestions(mapped);
    }
    setIsDeleteOpen(false);
  };

  const getDiffColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtered = selectedLesson
      ? questions.filter(q =>
          q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : [];


  return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Questions Management</h2>
              <p className="text-gray-600">Create and manage quiz questions</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button_admin className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                <Plus className="w-5 h-5 mr-2" /> Add Question
              </Button_admin>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create New Question</DialogTitle>
              </DialogHeader>
              <QuestionForm
                  modules={modules}
                  lessons={lessons}
                  onModuleChange={handleModuleSelect}

                  onSubmit={handleCreate}

              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
              value={selectedModule ?? ''}
              onChange={(e) => handleModuleSelect(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
          >
            <option value="" disabled>Chọn Courses</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select
              value={selectedLesson ?? ''}
              onChange={(e) => handleLessonSelect(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
          >
            <option value="" disabled>Chọn Lesson</option>
            {lessons.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-auto max-w-sm"
          />
        </div>


        {/* List */}
        {selectedLesson ? (
            filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((q) => (
                      <div
                          key={q.id}
                          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {/* Type badge */}
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            {QUESTION_TYPE_MAP[q.questionTypeId] ?? 'Unknown'}
                          </Badge>

                          {/* Difficulty badge */}
                          <Badge className={`text-xs ${getDiffColor(q.difficulty)}`}>
                            {q.difficulty}
                          </Badge>

                          {/* Points */}
                          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full ml-auto">
              {q.points} pts
            </span>
                        </div>

                        {/* Question text */}
                        <h3 className="text-lg font-black text-gray-800 mb-2 line-clamp-2">
                          {q.questionText}
                        </h3>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2">
                          <Button_admin
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedQuestion(q);
                                setIsViewOpen(true);
                              }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button_admin>
                          <Button_admin
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedQuestion(q);
                                setIsEditOpen(true);
                              }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button_admin>
                          <Button_admin
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                setSelectedQuestion(q);
                                setIsDeleteOpen(true);
                              }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button_admin>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-gray-500">Không có câu hỏi nào khớp với từ khoá.</div>
            )
        ) : (
            <div className="text-muted-foreground">Vui lòng chọn một bài học để xem câu hỏi.</div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Edit Question</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
                <QuestionForm
                    initialData={selectedQuestion}
                    modules={modules}
                    lessons={lessons}
                    onModuleChange={handleModuleSelect}
                    onSubmit={handleUpdate}
                />
            )}
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Question Details</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
                <QuestionDetails question={selectedQuestion} />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Delete Question</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
                <DeleteConfirmation
                    userName={selectedQuestion.questionText}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default QuestionsCRUD;
