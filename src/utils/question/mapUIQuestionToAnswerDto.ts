import { AnswerCreateDto, UIQuestion } from '@/types';

export function mapUIQuestionToAnswerDto(ui: UIQuestion, questionId: number): AnswerCreateDto[] {
    return ui.answers
        .filter((a) => a.answerText?.trim() !== '')
        .map((a) => ({
            questionId,
            answerText: a.answerText,
            caseSensitive: a.caseSensitive,
            position: a.position,
        }));
}
