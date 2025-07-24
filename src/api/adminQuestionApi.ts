import {
    Module,
    Lesson,
    QuestionCreateDto,
    QuestionResponseDto,
    UIQuestion, OptionCreateDto, AnswerCreateDto,
} from '@/types';

import {
    mapUIQuestionToCreateDto,
    mapUIQuestionToUpdateDto,
    mapQuestionResponseToUIQuestion,
    mapUIQuestionToAnswerDto,
} from '../utils/index';
import axios from 'axios';

const BASE = 'http://localhost:8080/api';

function authHeader(): Record<string, string> {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getQuestionsByLesson = async (lessonId: number): Promise<QuestionResponseDto[]> => {
    const res = await axios.get(`${BASE}/questions`, {
        headers: authHeader(),
        params: { lessonId },
    });
    return res.data;
};

export const getAllQuestions = async (): Promise<QuestionResponseDto[]> => {
    const res = await axios.get(`${BASE}/questions/all`, {
        headers: authHeader(),
    });
    return res.data;
};

export const fetchModules = async (): Promise<Module[]> => {
    const res = await fetch(`${BASE}/courses`, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error('Lỗi lấy modules');
    const data = await res.json();
    return data.map((m: any) => ({
        id: m.id,
        name: m.name || m.title,
    }));
};

export async function fetchLessonsByModule(moduleId: number): Promise<Lesson[]> {
    const res = await fetch(`${BASE}/questions/by-module/${moduleId}`, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Lỗi khi lấy lessons");
    return await res.json();
}

export const fetchQuestionsByLesson = async (lessonId: number): Promise<UIQuestion[]> => {
    const res = await fetch(`${BASE}/questions?lessonId=${lessonId}`, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error('Lỗi lấy questions');
    const data: QuestionResponseDto[] = await res.json();
    return data.map(mapQuestionResponseToUIQuestion);
};

export const fetchQuestionById = async (id: number): Promise<UIQuestion> => {
    const res = await fetch(`${BASE}/questions/${id}`, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error('Không thể lấy question');
    const data: QuestionResponseDto = await res.json();
    return mapQuestionResponseToUIQuestion(data);
};

export const createQuestion = async (form: UIQuestion): Promise<UIQuestion> => {
    const dto = mapUIQuestionToCreateDto(form);

    // Gửi câu hỏi chính
    const res = await fetch(`${BASE}/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
        },
        body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error((await res.json()).message || 'Lỗi tạo câu hỏi');
    const created: QuestionResponseDto = await res.json();
    const questionId = created.id;

    // Gửi thêm options hoặc answers
    if (form.questionTypeId === 4) {
        const answerDtos: AnswerCreateDto[] = mapUIQuestionToAnswerDto(form, questionId);
        await fetch(`${BASE}/questions/${questionId}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
            body: JSON.stringify(answerDtos),
        });
    } else {
        const optionDtos: OptionCreateDto[] = form.options.map((o) => ({
            questionId,
            optionText: o.optionText,
            correct: o.correct,
            position: o.position,
            imageUrl: o.imageUrl,
        }));

        await fetch(`${BASE}/question-options/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
            body: JSON.stringify(optionDtos),
        });
    }

    // Lấy lại câu hỏi vừa tạo (có đầy đủ fields)
    const finalRes = await fetch(`${BASE}/questions/${questionId}`, {
        headers: authHeader(),
    });

    const fullData: QuestionResponseDto = await finalRes.json();
    return mapQuestionResponseToUIQuestion(fullData);
};


export const updateQuestion = async (id: number, form: UIQuestion): Promise<UIQuestion> => {
    const dto: QuestionCreateDto = mapUIQuestionToUpdateDto(form);
    const res = await fetch(`${BASE}/questions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(),
        },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Lỗi cập nhật câu hỏi');
    const data: QuestionResponseDto = await res.json();
    return mapQuestionResponseToUIQuestion(data);
};





export const deleteQuestion = async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/questions/${id}`, {
        method: 'DELETE',
        headers: authHeader(),
    });
    if (!res.ok) throw new Error('Lỗi xóa question');
};


