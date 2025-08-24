import { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';
import { StudentQuestion } from 'types'; // Sửa import

interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    results: Record<number, boolean>;
}

// Cập nhật QuizComponentProps
interface QuizComponentProps {
    questions: StudentQuestion[]; // Sửa kiểu dữ liệu
    lessonId: number;
    quizResult: QuizResult | null; // Thêm prop
    onQuizComplete: () => void;
    onSubmitAnswers: (answers: Record<number, number>) => void; // Sửa kiểu tham số
}

export const QuizComponent = ({ questions, lessonId, quizResult, onQuizComplete, onSubmitAnswers }: QuizComponentProps) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswerSelect = (questionId: number, optionId: number) => {
        setSelectedAnswers(prev => ({...prev, [questionId]: optionId}));
    };

    const handleSubmit = async () => {
        // Chỉ cần gọi hàm prop từ cha
        onSubmitAnswers(selectedAnswers);
    };

    if (quizResult) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FiAward className="text-4xl text-yellow-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold mb-4">Kết quả bài kiểm tra</h2>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                    {quizResult.score.toFixed(1)}%
                </div>
                <p className="text-gray-600 mb-4">
                    Đúng {quizResult.correctAnswers}/{quizResult.totalQuestions} câu
                </p>
                <button
                    onClick={onQuizComplete}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Quay lại bài học
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Bài kiểm tra</h2>

            {questions.map((q, index) => (
                <div key={q.id} className="mb-8 border-b border-gray-200 pb-6 last:border-b-0">
                    <p className="font-semibold text-lg mb-3 text-gray-800">
                        Câu {index + 1}: {q.questionText}
                    </p>
                    <div className="space-y-2">
                        {q.options.map((option) => (
                            <label
                                key={option.id}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedAnswers[q.id] === option.id
                                        ? 'bg-blue-100 border border-blue-300'
                                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    value={option.id}
                                    checked={selectedAnswers[q.id] === option.id}
                                    onChange={() => handleAnswerSelect(q.id, option.id)}
                                    className="form-radio text-blue-600 mr-3"
                                />
                                <span className="text-gray-800">{option.optionText}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                <span className="text-gray-600">
                    Đã trả lời: {Object.keys(selectedAnswers).length}/{questions.length} câu
                </span>
                <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== questions.length} // Bỏ isSubmitting vì QuizComponent không còn quản lý
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Nộp bài
                </button>
            </div>
        </div>
    );
};