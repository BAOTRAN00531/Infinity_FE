interface Question {
    id: number;
    questionText: string;
    lessonId: number;
    options: {
        id: number;
        optionText: string;
        correct: boolean;
        position: number;
    }[];
}

interface QuizComponentProps {
    questions: Question[];
}

export const QuizComponent = ({ questions }: QuizComponentProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Bài kiểm tra</h2>
            {questions.map((q, index) => (
                <div key={q.id} className="mb-6 border-b border-gray-200 pb-4">
                    <p className="font-semibold text-lg mb-2">
                        Câu {index + 1}: {q.questionText}
                    </p>
                    {q.options.map(option => (
                        <div
                            key={option.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                            <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={option.id}
                                className="form-radio text-blue-600"
                            />
                            <label className="text-gray-800">{option.optionText}</label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};