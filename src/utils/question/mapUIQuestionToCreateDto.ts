import { QuestionCreateDto, UIQuestion } from '@/types';

export function mapUIQuestionToCreateDto(ui: UIQuestion): QuestionCreateDto {
    return {
        questionText: ui.questionText,
        courseId: ui.courseId, // ✅ đúng rồi
        lessonId: ui.lessonId,
        questionTypeId: ui.questionTypeId,
        difficulty: ui.difficulty,
        points: ui.points,
        media: {
            mediaUrl: ui.media.mediaUrl,
            audioUrl: ui.media.audioUrl,
            videoUrl: ui.media.videoUrl,
        },
        options: ui.options.map((opt) => ({
            optionText: opt.optionText,
            correct: opt.correct,
            position: opt.position,
            imageUrl: opt.imageUrl,
        })),
        answers: ui.answers.map((ans) => ({
            answerText: ans.answerText,
            caseSensitive: ans.caseSensitive,
            position: ans.position,
        })),
    };
}
