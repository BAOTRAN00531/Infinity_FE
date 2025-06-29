  // src/components/inmutable-components/CRUD/form/QuestionForm.tsx
  import React, {useEffect, useState, FormEvent, useRef} from 'react';
  import {
    OptionCreateDto,
    AnswerCreateDto,
    QuestionDto
  } from '@/types'; // hoặc '@/types' nếu gộp chung
  import { Module, Lesson } from '@/types';
  import { Button_admin } from '@/components/reusable-components/button_admin';
  import { Input_admin } from '@/components/reusable-components/input_admin';
  import { Label } from '@/components/reusable-components/label';
  import { Textarea } from '@/components/reusable-components/textarea';

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/reusable-components/select';
  import { motion } from 'framer-motion';
  import axios from "axios";
  import {toast} from "react-toastify";

  import { UIQuestion } from '@/types';
  import {mapQuestionDtoToUIQuestion} from "@/utils"; // ✅ Thêm nếu thiếu

  interface QuestionFormProps {
    initialData?: UIQuestion;
    modules: Module[];
    lessons: Lesson[];
    onModuleChange: (moduleId: number) => void;
    onSubmit: (question: UIQuestion) => void;
  }

  export interface OptionDto extends OptionCreateDto {
    id: number;
  }

  export interface AnswerDto extends AnswerCreateDto {
    id: number;
  }


  type FormState = {
    questionText: string;
    questionTypeId: number;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    moduleId: number;
    lessonId: number;
  };


  type QuestionType = {
    id: number;
    code: string;
    description: string;
  };


  const QuestionForm: React.FC<QuestionFormProps> = ({ initialData, onSubmit }) => {
    const [modules, setModules] = useState<{
      name: string;
      id: number; title: string }[]>([]);
    const [lessons, setLessons] = useState<{ id: number; name: string }[]>([]);

    const [formData, setFormData] = useState<FormState>({
      questionText: initialData?.questionText || '',
      questionTypeId: initialData?.questionTypeId || 1, // default to first type
      difficulty: (initialData?.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
      points: initialData?.points || 10,
      moduleId: initialData?.moduleId || 0,
      lessonId: initialData?.lessonId || 0,
    });



    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

    useEffect(() => {
      const fetchQuestionTypes = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const res = await fetch('http://localhost:8080/api/question-types', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          setQuestionTypes(data);
        } catch (err) {
          toast.error('Không thể tải question types');
        }
      };

      fetchQuestionTypes();
    }, []);


    const [options, setOptions] = useState<OptionCreateDto[]>(
        initialData?.options || []
    );
    const [answers, setAnswers] = useState<AnswerCreateDto[]>(
        initialData?.answers || []
    );

    const addOption = () =>
        setOptions([
          ...options,
          {
            optionText: '',
            correct: false,
            position: options.length + 1, // ✅ position >= 1
          },
        ]);


    const removeOption = (index: number) =>
        setOptions(options.filter((_, i) => i !== index));
    const handleOptionChange = (
        index: number,
        field: keyof OptionCreateDto,
        value: OptionCreateDto[keyof OptionCreateDto]
    ) => {
      const updated = [...options];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      setOptions(updated);
    };

    const addAnswer = () =>
        setAnswers([
          ...answers,
          {
            answerText: '',
            caseSensitive: false,
            position: answers.length + 1, // ✅ position >= 1
          },
        ]);

    const removeAnswer = (index: number) =>
        setAnswers(answers.filter((_, i) => i !== index));
    const handleAnswerChange = (
        index: number,
        field: keyof AnswerCreateDto,
        value: AnswerCreateDto[keyof AnswerCreateDto]
    ) => {
      const updated = [...answers];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      setAnswers(updated);
    };

    useEffect(() => {
      const fetchModules = async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) throw new Error('Bạn chưa đăng nhập');
          const res = await axios.get('http://localhost:8080/api/modules', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setModules(res.data);
        } catch (err) {
          console.error(err);
          toast.error('Không thể tải danh sách modules');
        }
      };

      fetchModules();
    }, []);

    useEffect(() => {
      const fetchLessons = async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token || !formData.moduleId) return;
          const res = await axios.get('http://localhost:8080/api/lessons', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { moduleId: formData.moduleId },
          });
          setLessons(res.data);
        } catch (err) {
          toast.error('Không tải được danh sách lessons');
        }
      };

      fetchLessons();
    }, [formData.moduleId]);

    const isSubmittingRef = useRef(false); // ✅ đảm bảo không submit nhiều lần

    const handleSubmit = (e: FormEvent) => {
      console.log("🟧 SUBMIT START");

      e.preventDefault();

      if (isSubmittingRef.current) {
        console.warn('Double submit bị chặn');
        return;
      }

      isSubmittingRef.current = true; // ✅ chặn các submit tiếp theo

      try {
        // ❗ Validate: nếu là multiple-choice thì cần ít nhất 1 option
        if ([1, 2].includes(formData.questionTypeId) && options.length === 0) {
          toast.error("Câu hỏi trắc nghiệm cần ít nhất 1 phương án!");
          return;
        }

        // ❗ Validate: nếu là multiple-choice thì ít nhất 1 đáp án đúng
        if ([1, 2].includes(formData.questionTypeId) && !options.some(o => o.correct)) {
          toast.error("Phải chọn ít nhất 1 đáp án đúng!");
          return;
        }

        // ❗ Validate: nếu là text-input thì cần ít nhất 1 answer
        if (formData.questionTypeId === 4 && answers.length === 0) {
          toast.error("Bạn cần nhập ít nhất 1 câu trả lời!");
          return;
        }

        // ✅ Lọc các option trùng nhau
        const filteredOptions = options.filter((opt, idx, arr) => {
          return (
              arr.findIndex(
                  (o) =>
                      o.optionText.trim().toLowerCase() === opt.optionText.trim().toLowerCase() &&
                      o.position === opt.position
              ) === idx
          );
        });
        console.log("🔥 Submitting question with options:", filteredOptions)

        if (filteredOptions.length < options.length) {
          toast.warn("Đã loại bỏ các phương án trùng.");
        }

        const dto = new QuestionDto({
          questionText: formData.questionText,
          questionTypeId: formData.questionTypeId,
          lessonId: formData.lessonId,
          difficulty: formData.difficulty,
          points: formData.points,
          options: filteredOptions.map((o, i) => ({
            optionText: o.optionText,
            correct: o.correct,
            position: i + 1,
            imageUrl: o.imageUrl,
            ...(initialData?.id ? { questionId: initialData.id } : {})
          })),

          answers: formData.questionTypeId === 4
              ? answers.map((a, i) => ({
                answerText: a.answerText,
                caseSensitive: a.caseSensitive,
                position: i + 1,
                ...(initialData?.id ? { questionId: initialData.id } : {})
              }))
              : [],
        });

        const uiQuestion = mapQuestionDtoToUIQuestion(dto);
        console.log('UIQuestion', uiQuestion)
        onSubmit(uiQuestion);
      } catch (err) {
        console.error("Submit lỗi:", err);
        toast.error("Có lỗi xảy ra khi gửi câu hỏi.");
      } finally {
        isSubmittingRef.current = false; // ✅ cho phép submit lại
      }

      console.log("🟩 SUBMIT DONE");

    };




    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
          {/* Question Text */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              Question
            </Label>
            <Textarea
                value={formData.questionText}
                onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                }
                className="rounded-2xl border-2 border-gray-200 focus:border-orange-400"
                placeholder="Enter your question here..."
                required
            />
          </div>

          {/* Type & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                Type
              </Label>
              <Select
                  value={formData.questionTypeId.toString()}
                  onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        questionTypeId: parseInt(val, 10),
                      })
                  }
              >
                <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {questionTypes.map((qt) => (
                      <SelectItem key={qt.id} value={qt.id.toString()}>
                        {qt.description}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                Difficulty
              </Label>
              <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        difficulty: value as FormState['difficulty'],
                      })
                  }
              >
                <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Module & Lesson */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                Module
              </Label>
              <Select
                  value={formData.moduleId.toString()}
                  onValueChange={(val) => {
                    const mid = parseInt(val);
                    setFormData({
                      ...formData,
                      moduleId: mid,
                      lessonId: 0,
                    });
                  }}
              >
                <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {modules.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.name || m.title}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>




            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">
                Lesson
              </Label>
              <Select
                  value={formData.lessonId.toString()}
                  onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        lessonId: parseInt(val),
                      })
                  }
              >
                <SelectTrigger className="rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {lessons.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>
                        {l.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              Points
            </Label>
            <Input_admin
                type="number"
                value={formData.points} // ✅ sửa score -> points
                onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value, 10),
                    })
                }
            />

          </div>





          {/* Options or Answers UI */}
          {[1, 2].includes(formData.questionTypeId) && ( // Multiple choice (1 hoặc 2)
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Options</Label>
                {options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input_admin
                          placeholder={`Option ${index + 1}`}
                          value={opt.optionText}
                          onChange={(e) =>
                              handleOptionChange(index, 'optionText', e.target.value)
                          }
                          className="flex-1"
                      />
                      <input
                          type="checkbox"
                          checked={opt.correct}
                          onChange={(e) =>
                              handleOptionChange(index, 'correct', e.target.checked)
                          }
                      />
                      <Button_admin
                          type="button"
                          variant="ghost"
                          onClick={() => removeOption(index)}
                          className="text-red-500"
                      >
                        Remove
                      </Button_admin>
                    </div>
                ))}
                <Button_admin type="button" onClick={addOption} className="mt-2">
                  + Add Option
                </Button_admin>
              </div>
          )}

          {formData.questionTypeId === 4 && ( // Text Input
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Answers</Label>
                {answers.map((ans, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input_admin
                          placeholder={`Answer ${index + 1}`}
                          value={ans.answerText}
                          onChange={(e) =>
                              handleAnswerChange(index, 'answerText', e.target.value)
                          }
                          className="flex-1"
                      />
                      <input
                          type="checkbox"
                          checked={ans.caseSensitive}
                          onChange={(e) =>
                              handleAnswerChange(index, 'caseSensitive', e.target.checked)
                          }
                      />
                      <Button_admin
                          type="button"
                          variant="ghost"
                          onClick={() => removeAnswer(index)}
                          className="text-red-500"
                      >
                        Remove
                      </Button_admin>
                    </div>
                ))}
                <Button_admin type="button" onClick={addAnswer} className="mt-2">
                  + Add Answer
                </Button_admin>
              </div>
          )}




          {/* Submit */}
          <div className="flex justify-end pt-6">
            <Button_admin
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {initialData ? 'Update Question' : 'Create Question'}
            </Button_admin>
          </div>
        </motion.form>
    );
  };

  export default QuestionForm;
