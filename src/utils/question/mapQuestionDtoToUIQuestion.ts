import { QuestionDto, UIQuestion } from '../../types';

export function mapQuestionDtoToUIQuestion(dto: QuestionDto): UIQuestion {
    return {
        id: dto.id ?? -1, // fallback nếu chưa có id
        moduleId: dto.moduleId, // ✅ THÊM DÒNG NÀY
        questionText: dto.questionText,
        courseId: dto.moduleId, // nếu bạn vẫn muốn giữ
        lessonId: dto.lessonId,
        questionTypeId: dto.questionTypeId,
        difficulty: dto.difficulty,
        points: dto.points,
        media: {
            mediaUrl: undefined,
            audioUrl: undefined,
            videoUrl: undefined,
        },
        options: dto.options?.map((o, index) => ({
            id: index,
            optionText: o.optionText,
            correct: o.correct,
            position: o.position,
            imageUrl: o.imageUrl,
        })) ?? [],
        answers: dto.answers?.map((a, index) => ({
            id: index,
            answerText: a.answerText,
            caseSensitive: a.caseSensitive,
            position: a.position,
        })) ?? [],
    };
}
