// src/components/QuestionsList.tsx
import React, { useEffect, useState } from 'react';
import { getQuestionsByLesson } from '@/api/adminQuestionApi';
import { QuestionResponseDto } from '../../types';
import { Card, CardContent } from '../../components/reusable-components/card';

interface Props {
    lessonId: number;
}

const QuestionsList: React.FC<Props> = ({ lessonId }) => {
    const [questions, setQuestions] = useState<QuestionResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuestionsByLesson(lessonId)
            .then(setQuestions)
            .finally(() => setLoading(false));
    }, [lessonId]);

    if (loading) return <div>Đang tải câu hỏi...</div>;
    if (!questions.length) return <div>Không có câu hỏi nào.</div>;

    return (
        <div className="grid gap-4">
            {questions.map((q) => (
                <Card key={q.id} className="shadow border rounded-xl">
                    <CardContent className="p-4">
                        <div className="font-semibold text-lg">{q.questionText}</div>
                        <div className="text-sm text-muted-foreground">
                            ID: {q.id} | Type ID: {q.questionTypeId} | Điểm: {q.points}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default QuestionsList;
