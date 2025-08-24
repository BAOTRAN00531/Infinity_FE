import api from '@/api';

// Thêm API service riêng cho Quiz
export const quizService = {
    getQuestions: (lessonId: number) =>
        api.get(`/api/student/quiz/lesson/${lessonId}/questions`),

    submitQuiz: (lessonId: number, answers: Record<number, number>) =>
        api.post(`/api/student/quiz/lesson/${lessonId}/submit`, { answers }),

    getResults: (quizSessionId: number) =>
        api.get(`/api/student/quiz/session/${quizSessionId}/results`)
};