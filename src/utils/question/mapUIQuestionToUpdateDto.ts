import { QuestionCreateDto, UIQuestion } from '../../types';

export function mapUIQuestionToUpdateDto(q: UIQuestion): QuestionCreateDto {
    return {
        questionText: q.questionText,
        courseId: q.courseId,
        lessonId: q.lessonId,
        questionTypeId: q.questionTypeId,
        difficulty: q.difficulty,
        points: q.points,
        media: q.media,
        options: q.options?.map(o => ({
            questionId: q.id,
            optionText: o.optionText,
            correct: o.correct,
            position: o.position,
            imageUrl: o.imageUrl,
        })),
        answers: q.answers?.map(a => ({
            questionId: q.id,
            answerText: a.answerText,
            caseSensitive: a.caseSensitive,
            position: a.position,
        })),
    };
}
