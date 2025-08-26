  // src/components/inmutable-components/CRUD/form/QuestionForm.tsx
  import React, {useEffect, useState, FormEvent, useRef} from 'react';
  import {
    OptionCreateDto,
    AnswerCreateDto,
    QuestionDto
  } from '@/types'; // hoặc '@/types' nếu gộp chung
  import { Lesson } from '@/types';
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
  import {toast} from "react-toastify";

  import { UIQuestion } from '@/types';
  import {mapQuestionDtoToUIQuestion} from "@/utils"; // ✅ Thêm nếu thiếu
  import WordSuggestion from '@/components/inmutable-components/WordSuggestion'; // Đảm bảo đúng đường dẫn
  import { BookOpen } from 'lucide-react';
  import { Dialog, DialogContent } from '@/components/reusable-components/dialog';
  import api from "@/api";
  import { fetchLanguages, fetchModulesByLanguage, Language, ModuleLite } from '@/api/adminQuestionApi';
  import { lexiconApi } from '@/api/lexiconApi'; // ✅ Thêm import lexiconApi

  interface QuestionFormProps {
    initialData?: UIQuestion;
    modules: ModuleLite[];
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
    ipa?: string;
    hint?: string;
    explanation?: string;
  };


  type QuestionType = {
    id: number;
    code: string;
    description: string;
  };


  const QuestionForm: React.FC<QuestionFormProps> = ({ initialData, onSubmit }) => {
    const [modules, setModules] = useState<ModuleLite[]>([]);
    const [lessons, setLessons] = useState<{ id: number; name: string }[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');

    // ✅ Thêm state cho WordSuggestion data
    const [suggestionUnits, setSuggestionUnits] = useState<any[]>([]);
    const [suggestionPhrases, setSuggestionPhrases] = useState<any[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const [formData, setFormData] = useState<FormState>({
      questionText: initialData?.questionText || '',
      questionTypeId: initialData?.questionTypeId || 1, // default to first type
      difficulty: (initialData?.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
      points: initialData?.points || 10,
      moduleId: initialData?.moduleId || 0,
      lessonId: initialData?.lessonId || 0,
    });



    const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

// Lấy question types
    useEffect(() => {
      const fetchQuestionTypes = async () => {
        try {
          const res = await api.get('/api/question-types');
          if (!Array.isArray(res.data)) {
            setQuestionTypes([]);
            toast.error('Dữ liệu question types không hợp lệ!', { autoClose: 1200 });
            return;
          }
          setQuestionTypes(res.data);
        } catch {
          setQuestionTypes([]);
          toast.error('Không thể tải question types', { autoClose: 1200 });
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

// Lấy languages và modules theo language
useEffect(() => {
  const loadLanguages = async () => {
    try {
      // Sử dụng cùng lexiconApi thay vì adminQuestionApi
      const langs = await lexiconApi.languages.getAll();
      setLanguages(langs);
      // Set mặc định ngôn ngữ đầu tiên nếu chưa chọn
      if (!selectedLanguage && langs.length > 0) {
        setSelectedLanguage(langs[0].code);
      }
    } catch (err) {
      console.error('❌ Error loading languages:', err);
      toast.error('Không thể tải danh sách ngôn ngữ', { autoClose: 1200 });
    }
  };
  loadLanguages();
}, []);

    useEffect(() => {
      const loadModulesByLanguage = async () => {
        if (!selectedLanguage) return;
        try {
          const mods = await fetchModulesByLanguage(selectedLanguage);
          setModules(mods);
          // Auto-select the first module if exists
          if (mods.length > 0) {
            setFormData(prev => ({ ...prev, moduleId: mods[0].id, lessonId: 0 }));
          }
        } catch (err) {
          toast.error('Không thể tải courses theo ngôn ngữ', { autoClose: 1200 });
        }
      };
      // reset selections downstream khi đổi ngôn ngữ
      setFormData(prev => ({ ...prev, moduleId: 0, lessonId: 0 }));
      setLessons([]);
      loadModulesByLanguage();
    }, [selectedLanguage]);

// Lấy lessons theo moduleId
    useEffect(() => {
      const fetchLessons = async () => {
        try {
          if (!formData.moduleId) return;
          const res = await api.get('/api/lessons', {
            params: { moduleId: formData.moduleId },
          });
          const lessonList = Array.isArray(res.data) ? res.data : [];
          setLessons(lessonList);
          // Auto-select first lesson if exists
          if (lessonList.length > 0) {
            setFormData(prev => ({ ...prev, lessonId: lessonList[0].id }));
          } else {
            setFormData(prev => ({ ...prev, lessonId: 0 }));
          }
        } catch {
          toast.error('Không tải được danh sách lessons', { autoClose: 1200 });
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
          toast.error("Câu hỏi trắc nghiệm cần ít nhất 1 phương án!", {
            autoClose: 1200, // 👈 1.2 giây riêng lẻ
          });
          return;
        }

        // ❗ Validate: nếu là multiple-choice thì ít nhất 1 đáp án đúng
        if ([1, 2].includes(formData.questionTypeId) && !options.some(o => o.correct)) {
          toast.error("Phải chọn ít nhất 1 đáp án đúng!", {
            autoClose: 1200, // 👈 1.2 giây riêng lẻ
          });
          return;
        }

        // ❗ Validate: nếu là text-input thì cần ít nhất 1 answer
        if (formData.questionTypeId === 4 && answers.length === 0) {
          toast.error("Bạn cần nhập ít nhất 1 câu trả lời!", {
            autoClose: 1200, // 👈 1.2 giây riêng lẻ
          });
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
        toast.error("Có lỗi xảy ra khi gửi câu hỏi.", {
          autoClose: 1200, // 👈 1.2 giây riêng lẻ
        });
      } finally {
        isSubmittingRef.current = false; // ✅ cho phép submit lại
      }

      console.log("🟩 SUBMIT DONE");

    };

  const [suggestOpen, setSuggestOpen] = useState<{ type: 'answer' | 'option', index?: number } | null>(null);

  // ✅ Thêm function để load suggestions từ API
  const loadSuggestions = async (languageCode: string) => {
    if (!languageCode) return;
    
    try {
      setLoadingSuggestions(true);
      console.log('🔄 Loading suggestions for language:', languageCode);
      
      // Load vocabulary units - sử dụng API đúng
      console.log('📚 Calling lexiconApi.units.getByLanguage with:', languageCode);
      let units: any[] = [];
      
      try {
        const unitsResponse = await lexiconApi.units.getByLanguage(languageCode);
        console.log('📚 Raw units response:', unitsResponse);
        
        if (Array.isArray(unitsResponse) && unitsResponse.length > 0) {
          units = unitsResponse;
          console.log('✅ getByLanguage successful, got units:', units.length);
        } else {
          console.log('⚠️ getByLanguage returned empty, trying getAll + filter...');
          // Fallback: lấy tất cả rồi lọc theo ngôn ngữ
          const allUnitsResponse = await lexiconApi.units.getAll();
          console.log('📚 getAll response:', allUnitsResponse);
          
          if (allUnitsResponse && allUnitsResponse.result && Array.isArray(allUnitsResponse.result)) {
            console.log('📚 Total units from getAll:', allUnitsResponse.result.length);
            
            // Lọc theo ngôn ngữ với logic cải thiện
            units = allUnitsResponse.result.filter((unit: any) => {
              const unitLang = unit.language;
              let matches = false;
              
              if (typeof unitLang === 'string') {
                matches = unitLang === languageCode || unitLang.startsWith(languageCode);
              } else if (typeof unitLang === 'object' && unitLang) {
                if (unitLang.code) {
                  matches = unitLang.code === languageCode || unitLang.code.startsWith(languageCode);
                } else if (unitLang.name) {
                  matches = unitLang.name.toLowerCase().includes(languageCode.toLowerCase());
                }
              }
              
              console.log(`  Unit "${unit.text}": language=${JSON.stringify(unitLang)}, matches=${matches}`);
              return matches;
            });
            
            console.log('📚 Fallback units filtered:', units.length);
          }
        }
      } catch (unitsError) {
        console.log('⚠️ getByLanguage failed, trying getAll + filter...', unitsError);
        // Fallback: lấy tất cả rồi lọc theo ngôn ngữ
        try {
          const allUnitsResponse = await lexiconApi.units.getAll();
          if (allUnitsResponse && allUnitsResponse.result && Array.isArray(allUnitsResponse.result)) {
            units = allUnitsResponse.result.filter((unit: any) => {
              const unitLang = unit.language;
              let matches = false;
              
              if (typeof unitLang === 'string') {
                matches = unitLang === languageCode || unitLang.startsWith(languageCode);
              } else if (typeof unitLang === 'object' && unitLang) {
                if (unitLang.code) {
                  matches = unitLang.code === languageCode || unitLang.code.startsWith(languageCode);
                } else if (unitLang.name) {
                  matches = unitLang.name.toLowerCase().includes(languageCode.toLowerCase());
                }
              }
              
              return matches;
            });
            console.log('📚 Fallback units filtered:', units.length);
          }
        } catch (fallbackError) {
          console.error('❌ Both getByLanguage and getAll failed:', fallbackError);
        }
      }
      
      console.log('📚 Final processed units:', units.length, units);
      
      // Load phrases - sử dụng API đúng
      console.log('💬 Calling lexiconApi.units.getPhrases');
      const phrasesResponse = await lexiconApi.units.getPhrases();
      console.log('💬 Raw phrases response:', phrasesResponse);
      
      // Lọc phrases theo ngôn ngữ được chọn
      let phrases: any[] = [];
      if (phrasesResponse && phrasesResponse.result && Array.isArray(phrasesResponse.result)) {
        console.log('💬 Total phrases from getPhrases:', phrasesResponse.result.length);
        
        phrases = phrasesResponse.result.filter((phrase: any) => {
          const phraseLang = phrase.language;
          let matches = false;
          
          if (typeof phraseLang === 'string') {
            matches = phraseLang === languageCode || phraseLang.startsWith(languageCode);
          } else if (typeof phraseLang === 'object' && phraseLang) {
            if (phraseLang.code) {
              matches = phraseLang.code === languageCode || phraseLang.code.startsWith(languageCode);
            } else if (phraseLang.name) {
              matches = phraseLang.name.toLowerCase().includes(languageCode.toLowerCase());
            }
          }
          
          console.log(`  Phrase "${phrase.text}": language=${JSON.stringify(phraseLang)}, matches=${matches}`);
          return matches;
        });
        
        console.log('💬 Filtered phrases by language:', phrases.length, phrases);
      }
      
      setSuggestionUnits(units);
      setSuggestionPhrases(phrases);
      
      console.log('✅ Final state - Units:', units.length, 'Phrases:', phrases.length);
      
      // Debug: Hiển thị chi tiết về dữ liệu được lọc
      if (units.length > 0) {
        console.log('📚 Sample units:');
        units.slice(0, 3).forEach((unit, index) => {
          console.log(`  ${index + 1}. "${unit.text}" (${unit.language}) - ${unit.type}`);
        });
      }
      
      if (phrases.length > 0) {
        console.log('💬 Sample phrases:');
        phrases.slice(0, 3).forEach((phrase, index) => {
          console.log(`  ${index + 1}. "${phrase.text}" (${phrase.language}) - ${phrase.type}`);
        });
      }
      
      if (units.length === 0 && phrases.length === 0) {
        console.log('⚠️ No data found for language:', languageCode);
        console.log('🔍 This might indicate:');
        console.log('   - No data exists for this language');
        console.log('   - Language code mismatch');
        console.log('   - API endpoint issues');
      }
      
    } catch (error) {
      console.error('❌ Error loading suggestions:', error);
      toast.error('Không thể tải danh sách từ vựng và cụm từ', { autoClose: 1200 });
      
      // Fallback to empty arrays
      setSuggestionUnits([]);
      setSuggestionPhrases([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // ✅ Load suggestions khi language thay đổi
  useEffect(() => {
    if (selectedLanguage) {
      console.log('🌍 Language changed to:', selectedLanguage);
      loadSuggestions(selectedLanguage);
    }
  }, [selectedLanguage]);

  // ✅ Thêm useEffect để debug khi suggestions thay đổi
  useEffect(() => {
    console.log('📊 Suggestions state updated:', {
      units: suggestionUnits.length,
      phrases: suggestionPhrases.length,
      selectedLanguage
    });
  }, [suggestionUnits, suggestionPhrases, selectedLanguage]);

  // ✅ Thêm useEffect để tự động load suggestions khi component mount
  useEffect(() => {
    if (selectedLanguage && suggestionUnits.length === 0 && suggestionPhrases.length === 0) {
      console.log('🚀 Component mounted, auto-loading suggestions for:', selectedLanguage);
      loadSuggestions(selectedLanguage);
    }
  }, [selectedLanguage, suggestionUnits.length, suggestionPhrases.length]);

  // ✅ Cập nhật handleWordSuggestion để sử dụng dữ liệu thực
  const handleWordSuggestion = (item: any, optionIndex?: number) => {
    if (formData.questionTypeId === 4) {
      // Fill in the blank: chỉ có 1 đáp án đúng
      if (answers.length === 0) addAnswer();
      handleAnswerChange(0, 'answerText', item.text);
      if (!formData.ipa && item.ipa) setFormData(prev => ({ ...prev, ipa: item.ipa }));
    } else if (typeof optionIndex === 'number') {
      // Multiple choice: cập nhật option tương ứng
      handleOptionChange(optionIndex, 'optionText', item.text);
    }
    setSuggestOpen(null); // Đóng modal sau khi chọn
  };

  // ❌ Xóa mockUnits và mockPhrases cũ
  // const mockUnits = [...];
  // const mockPhrases = [...];


    return (
    <form className="w-[1920px] h-[720px] max-w-full mx-auto bg-white rounded-2xl shadow-2xl p-10 space-y-6 overflow-y-auto" onSubmit={handleSubmit}>
      {/* Question Type */}
      <div className="mb-2">
        <Label className="text-base font-semibold mb-1 block">Question Type</Label>
        <Select
          value={formData.questionTypeId.toString()}
          onValueChange={val => setFormData({ ...formData, questionTypeId: parseInt(val) })}
        >
          <SelectTrigger className="rounded-xl border-2 border-gray-200 h-12 text-base">
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {questionTypes.map(qt => (
              <SelectItem key={qt.id} value={qt.id.toString()}>{qt.description}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question Content */}
      <div className="mb-2">
        <Label className="text-base font-semibold mb-1 block">Question Content</Label>
        <Textarea
          value={formData.questionText}
          onChange={e => setFormData({ ...formData, questionText: e.target.value })}
          className="rounded-xl border-2 border-gray-200 h-20 text-base"
          placeholder="Enter your question here... (Markdown supported: **bold**, *italic*, [link](url))"
          required
        />
        <div className="flex gap-3 mt-3">
          <Button_admin type="button" className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">Upload Image</Button_admin>
          <Button_admin type="button" className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">Upload Audio</Button_admin>
          <Button_admin type="button" className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">Test TTS</Button_admin>
        </div>
      </div>

      {/* IPA Pronunciation */}
      <div className="mb-2">
        <Label className="text-base font-semibold mb-1 block">IPA Pronunciation (Optional)</Label>
        <Input_admin
          value={formData.ipa || ''}
          onChange={e => setFormData({ ...formData, ipa: e.target.value })}
          className="rounded-xl border-2 border-gray-200 h-12 text-base"
          placeholder="e.g. /həˈloʊ/"
        />
      </div>

      {/* Language */}
      <div className="mb-2">
        <Label className="text-base font-semibold mb-1 block">Language</Label>
        <Select
          value={selectedLanguage}
          onValueChange={(val) => setSelectedLanguage(val)}
        >
          <SelectTrigger className="rounded-xl border-2 border-gray-200 h-12 text-base">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {languages.map(lg => (
              <SelectItem key={lg.code} value={lg.code}>{lg.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Module/Lesson, Difficulty, Points */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div>
          <Label className="text-base font-semibold mb-1 block">Module/Lesson</Label>
          <Select
            value={formData.moduleId.toString()}
            onValueChange={val => setFormData({ ...formData, moduleId: parseInt(val), lessonId: 0 })}
          >
            <SelectTrigger className="rounded-xl border-2 border-gray-200 h-12 text-base">
              <SelectValue placeholder="Select a module" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {modules.map(m => (
                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-semibold mb-1 block">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={val => setFormData({ ...formData, difficulty: val as any })}
          >
            <SelectTrigger className="rounded-xl border-2 border-gray-200 h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-semibold mb-1 block">Points</Label>
          <Input_admin
            type="number"
            value={formData.points}
            onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            className="rounded-xl border-2 border-gray-200 h-12 text-base"
          />
        </div>
      </div>

      {/* Part */}
      <div className="mb-2">
        <Label className="text-base font-semibold mb-1 block">Part</Label>
        <Select
          value={formData.lessonId.toString()}
          onValueChange={val => setFormData({ ...formData, lessonId: parseInt(val) })}
          disabled={!formData.moduleId}
        >
          <SelectTrigger className="rounded-xl border-2 border-gray-200 h-12 text-base">
            <SelectValue placeholder="Select a part" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {lessons.map(l => (
              <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Answer Options hoặc Correct Answer */}
      {formData.questionTypeId === 4 ? (
        <div className="mb-2">
          <Label className="text-base font-semibold mb-1 block">Correct Answer</Label>
          <div className="flex gap-3">
            <Input_admin
              value={answers[0]?.answerText || ''}
              onChange={e => {
                const val = e.target.value;
                if (answers.length === 0) addAnswer();
                handleAnswerChange(0, 'answerText', val);
              }}
              className="flex-1 rounded-xl border-2 border-gray-200 h-12 text-base"
              placeholder="Enter the correct answer..."
            />
            <button
              type="button"
              className="rounded-xl border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-semibold flex items-center gap-1"
              onClick={() => setSuggestOpen({ type: 'answer' })}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Suggest
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-semibold">Answer Options</Label>
            <Button_admin type="button" onClick={addOption} className="rounded-xl px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold flex items-center gap-1"><span className="text-lg">+</span> Add Option</Button_admin>
          </div>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 shadow-sm" key={i}>
                <input type="checkbox" checked={opt.correct} onChange={e => handleOptionChange(i, 'correct', e.target.checked)} className="w-5 h-5 accent-blue-600 rounded" />
                <Input_admin
                  value={opt.optionText}
                  onChange={e => handleOptionChange(i, 'optionText', e.target.value)}
                  className="flex-1 rounded-xl border-2 border-gray-200 h-10 text-base"
                  placeholder={`Option ${i + 1}`}
                />
                <button
                  type="button"
                  className="rounded-xl border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-2 text-xs font-semibold flex items-center gap-1"
                  onClick={() => setSuggestOpen({ type: 'option', index: i })}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Suggest
                </button>
                <Button_admin type="button" className="rounded-xl px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold" onClick={() => removeOption(i)}>✕</Button_admin>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint & Explanation */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <Label className="text-base font-semibold mb-1 block">Hint (Optional)</Label>
          <Textarea
            value={formData.hint || ''}
            onChange={e => setFormData({ ...formData, hint: e.target.value })}
            className="rounded-xl border-2 border-gray-200 h-12 text-base"
            placeholder="Provide a helpful hint..."
          />
        </div>
        <div>
          <Label className="text-base font-semibold mb-1 block">Explanation (Optional)</Label>
          <Textarea
            value={formData.explanation || ''}
            onChange={e => setFormData({ ...formData, explanation: e.target.value })}
            className="rounded-xl border-2 border-gray-200 h-12 text-base"
            placeholder="Explain why this is the correct answer..."
          />
        </div>
      </div>

      {/* Preview & Submit */}
      <div className="flex justify-between mt-6 gap-4">
        <Button_admin type="button" className="rounded-xl border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 flex-1 h-12 text-base font-semibold">Preview Question</Button_admin>
        <Button_admin type="submit" className="rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white flex-1 h-12 text-base font-semibold hover:from-blue-600 hover:to-green-600">{initialData ? 'Update Question' : 'Create Question'}</Button_admin>
      </div>

      {/* Modal WordSuggestion */}
      {suggestOpen && (
        <Dialog open={!!suggestOpen} onOpenChange={open => !open && setSuggestOpen(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] rounded-3xl">
            <WordSuggestion
              units={suggestionUnits}
              phrases={suggestionPhrases}
              onSelect={item =>
                suggestOpen.type === 'answer'
                  ? handleWordSuggestion(item)
                  : handleWordSuggestion(item, suggestOpen.index)
              }
            />
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
  };

  export default QuestionForm;
