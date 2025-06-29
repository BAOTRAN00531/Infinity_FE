// utils/mapQuestion.ts
import { UIQuestion } from "../../types";
import { QuestionResponseDto } from "../../types"; // nếu có

export function mapToUIQuestion(dto: QuestionResponseDto): UIQuestion {
    return {
        id: dto.id,
        questionText: dto.questionText,
        courseId: dto.courseId ?? undefined,
        lessonId: dto.lessonId,
        moduleId: dto.moduleId,
        questionTypeId: dto.questionTypeId,
        difficulty: dto.difficulty,
        points: dto.points,
        media: {
            mediaUrl: dto.media?.mediaUrl || undefined,
            audioUrl: dto.media?.audioUrl || undefined,
            videoUrl: dto.media?.videoUrl || undefined,
        },
        options: dto.options?.map(o => ({
            id: o.id,
            optionText: o.optionText,
            correct: o.correct,
            position: o.position,
            imageUrl: o.imageUrl ?? undefined,
        })) || [],
        answers: dto.answers?.map(a => ({
            id: a.id,
            answerText: a.answerText,
            caseSensitive: a.caseSensitive,
            position: a.position,
        })) || [],
        createdBy: dto.createdBy ?? undefined,
        createdAt: dto.createdAt ?? undefined,
        updatedBy: dto.updatedBy ?? undefined,
        updatedAt: dto.updatedAt ?? undefined,
    };
}
