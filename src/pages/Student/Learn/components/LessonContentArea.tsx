import { FiClock, FiCheckCircle, FiFileText, FiPlay } from 'react-icons/fi';
import { QuizComponent } from './QuizComponent';
import { Lesson } from 'types';

interface LessonContentAreaProps {
    selectedLesson: Lesson | null;
    isQuizMode: boolean;
    questions: any[]; // Replace with your Question type
    onMarkComplete: (lessonId: number) => void;
    onStartQuiz: (lessonId: number) => void;
}

export const LessonContentArea = ({
                                      selectedLesson,
                                      isQuizMode,
                                      questions,
                                      onMarkComplete,
                                      onStartQuiz
                                  }: LessonContentAreaProps) => {
    if (isQuizMode) {
        return <QuizComponent questions={questions} />;
    }

    if (selectedLesson) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h2 className="text-2xl font-bold mb-4">{selectedLesson.name}</h2>
                {selectedLesson.type === 'video' && selectedLesson.videoUrl ? (
                    <div className="aspect-video mb-6">
                        <iframe
                            src={selectedLesson.videoUrl}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                ) : (
                    <div className="prose max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                    </div>
                )}
                <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2" />
                        <span>{selectedLesson.duration}</span>
                    </div>
                    {!selectedLesson.isCompleted && (
                        <button
                            onClick={() => onMarkComplete(selectedLesson.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <FiCheckCircle className="mr-2" />
                            Đánh dấu đã hoàn thành
                        </button>
                    )}
                    {selectedLesson.isCompleted && (
                        <button
                            onClick={() => onStartQuiz(selectedLesson.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <FiFileText className="mr-2" />
                            Làm bài kiểm tra
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <FiPlay className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Chọn một bài học để bắt đầu</p>
            <p className="text-gray-400 text-sm mt-2">Nhấn vào bài học trong danh sách bên phải</p>
        </div>
    );
};