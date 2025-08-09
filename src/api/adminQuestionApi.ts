import {
    Module,
    Lesson,
    QuestionCreateDto,
    QuestionResponseDto,
    UIQuestion,
    OptionCreateDto,
    AnswerCreateDto,
} from '@/types';

import {
    mapUIQuestionToCreateDto,
    mapUIQuestionToUpdateDto,
    mapQuestionResponseToUIQuestion,
    mapUIQuestionToAnswerDto,
} from '../utils/index';

import api from '@/api'; // ✅ Dùng API instance đã config

export const getQuestionsByLesson = async (lessonId: number): Promise<QuestionResponseDto[]> => {
    const res = await api.get('/questions', { params: { lessonId } });
    return res.data;
};

export const getAllQuestions = async (): Promise<QuestionResponseDto[]> => {
    const res = await api.get('/questions/all');
    return res.data;
};

export const fetchModules = async (): Promise<Module[]> => {
    const res = await api.get('/courses');
    return res.data.map((m: any) => ({
        id: m.id,
        name: m.name || m.title,
    }));
};

export async function fetchLessonsByModule(moduleId: number): Promise<Lesson[]> {
    const res = await api.get(`/questions/by-module/${moduleId}`);
    return res.data;
}

export const fetchQuestionsByLesson = async (lessonId: number): Promise<UIQuestion[]> => {
    const res = await api.get('/questions', { params: { lessonId } });
    return res.data.map(mapQuestionResponseToUIQuestion);
};

export const fetchQuestionById = async (id: number): Promise<UIQuestion> => {
    const res = await api.get(`/questions/${id}`);
    return mapQuestionResponseToUIQuestion(res.data);
};

export const createQuestion = async (form: UIQuestion): Promise<UIQuestion> => {
    const dto = mapUIQuestionToCreateDto(form);

    // Gửi câu hỏi chính
    const res = await api.post('/questions', dto);
    const created: QuestionResponseDto = res.data;
    const questionId = created.id;

    // Gửi thêm options hoặc answers
    if (form.questionTypeId === 4) {
        const answerDtos: AnswerCreateDto[] = mapUIQuestionToAnswerDto(form, questionId);
        await api.post(`/questions/${questionId}/answers`, answerDtos);
    } else {
        const optionDtos: OptionCreateDto[] = form.options.map((o) => ({
            questionId,
            optionText: o.optionText,
            correct: o.correct,
            position: o.position,
            imageUrl: o.imageUrl,
        }));
        await api.post('/question-options/batch', optionDtos);
    }

    // Lấy lại câu hỏi vừa tạo (có đầy đủ fields)
    const finalRes = await api.get(`/questions/${questionId}`);
    return mapQuestionResponseToUIQuestion(finalRes.data);
};

export const updateQuestion = async (id: number, form: UIQuestion): Promise<UIQuestion> => {
    const dto: QuestionCreateDto = mapUIQuestionToUpdateDto(form);
    const res = await api.put(`/questions/${id}`, dto);
    return mapQuestionResponseToUIQuestion(res.data);
};

export const deleteQuestion = async (id: number): Promise<void> => {
    await api.delete(`/questions/${id}`);
};
