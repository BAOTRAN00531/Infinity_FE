// src/utils/question/mapQuestionResponseToUIQuestion.ts
import { QuestionResponseDto, UIQuestion } from '@/types';

export function mapQuestionResponseToUIQuestion(dto: QuestionResponseDto): UIQuestion {
    return {
        id: dto.id,
        moduleId: dto.courseId ?? -1, // fallback nếu cần
        courseId: dto.courseId,
        lessonId: dto.lessonId,
        questionText: dto.questionText,
        questionTypeId: dto.questionTypeId,
        difficulty: dto.difficulty,
        points: dto.points,
        media: {
            mediaUrl: dto.media?.mediaUrl ?? undefined,
            audioUrl: dto.media?.audioUrl ?? undefined,
            videoUrl: dto.media?.videoUrl ?? undefined,
        },
        options: dto.options?.map(opt => ({
            id: opt.id,
            optionText: opt.optionText,
            correct: opt.correct,
            position: opt.position,
            imageUrl: opt.imageUrl ?? undefined,
        })) ?? [],
        answers: dto.answers?.map(ans => ({
            id: ans.id,
            answerText: ans.answerText,
            caseSensitive: ans.caseSensitive,
            position: ans.position,
        })) ?? [],
        createdBy: dto.createdBy,
        createdAt: dto.createdAt,
        updatedBy: dto.updatedBy,
        updatedAt: dto.updatedAt,
    };
}
