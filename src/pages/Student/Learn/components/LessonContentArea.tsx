// src/pages/learning/components/LessonContentArea.tsx

import React, { useEffect, useRef } from 'react';
import { FiClock, FiCheckCircle, FiFileText, FiPlay } from 'react-icons/fi';
import YouTube from 'react-youtube';
import { QuizComponent } from './QuizComponent';
import { Lesson, StudentQuestion } from 'types'; // Sửa import

// Interface cho kết quả quiz (thêm vào đây nếu bạn muốn sử dụng)
interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    results: Record<number, boolean>;
}

// Cập nhật LessonContentAreaProps
interface LessonContentAreaProps {
    selectedLesson: Lesson | null;
    isQuizMode: boolean;
    questions: StudentQuestion[]; // Sửa kiểu dữ liệu
    quizResult: QuizResult | null; // Thêm prop
    onMarkComplete: (lessonId: number) => void;
    onStartQuiz: (lessonId: number) => void;
    onQuizSubmit: (answers: Record<number, number>) => void; // Thêm prop
    onQuizComplete: () => void; // Thêm prop
}

export const LessonContentArea = ({
                                      selectedLesson,
                                      isQuizMode,
                                      questions,
                                      quizResult,
                                      onMarkComplete,
                                      onStartQuiz,
                                      onQuizSubmit,
                                      onQuizComplete,
                                  }: LessonContentAreaProps) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sử dụng useEffect để xử lý logic tự động đánh dấu hoàn thành
    useEffect(() => {
        if (!selectedLesson || isQuizMode) {
            // Xóa timer nếu không có bài học hoặc đang ở chế độ quiz
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        if (selectedLesson.type === 'document' && !selectedLesson.isCompleted) {
            const totalDurationInSeconds = parseDurationToSeconds(selectedLesson.duration);
            if (totalDurationInSeconds > 0) {
                // Đặt timer cho bài học tài liệu
                timerRef.current = setTimeout(() => {
                    onMarkComplete(selectedLesson.id);
                }, totalDurationInSeconds * 1000);
            }
        }

        // Cleanup: Xóa timer khi component unmount hoặc selectedLesson thay đổi
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [selectedLesson, isQuizMode, onMarkComplete]);

    // Hàm xử lý khi video có sự thay đổi trạng thái
    const onPlayerStateChange = (event: any) => {
        const player = event.target;
        // Kiểm tra nếu video đang phát (state = 1)
        if (event.data === YouTube.PlayerState.PLAYING) {
            const checkProgress = setInterval(() => {
                const currentTime = player.getCurrentTime();
                const totalDuration = player.getDuration();
                // Nếu video đã xem được 90%
                if (currentTime / totalDuration >= 0.9) {
                    clearInterval(checkProgress);
                    if (selectedLesson && !selectedLesson.isCompleted) {
                        onMarkComplete(selectedLesson.id);
                    }
                }
            }, 1000); // Kiểm tra mỗi giây
            // Cleanup khi video dừng hoặc chuyển trạng thái
            player.getIframe().addEventListener('pause', () => clearInterval(checkProgress));
            player.getIframe().addEventListener('ended', () => clearInterval(checkProgress));
        }
    };

    // Hàm chuyển đổi duration (ví dụ: "15:30") thành giây
    const parseDurationToSeconds = (duration: string) => {
        if (!duration) return 0;
        const parts = duration.split(':');
        let seconds = 0;
        if (parts.length === 3) { // H:M:S
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) { // M:S
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 1) { // S
            seconds = parseInt(parts[0]);
        }
        return seconds;
    };

    if (isQuizMode && selectedLesson) {
        return (
            <QuizComponent
                questions={questions}
                lessonId={selectedLesson?.id || 0}
                quizResult={quizResult}
                onSubmitAnswers={onQuizSubmit} // Truyền prop từ cha
                onQuizComplete={onQuizComplete} // Truyền prop từ cha
            />
        );
    }

    if (selectedLesson) {
        // Cấu hình cho trình phát YouTube
        const opts = {
            height: '100%',
            width: '100%',
            playerVars: {
                autoplay: 1, // Tự động phát video
            },
        };

        // Trích xuất ID video từ URL
        const videoId = selectedLesson.videoUrl?.split('v=')[1]?.split('&')[0];

        return (
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h2 className="text-2xl font-bold mb-4">{selectedLesson.name}</h2>
                {selectedLesson.type === 'video' && videoId ? (
                    <div className="aspect-video mb-6">
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            onStateChange={onPlayerStateChange}
                            className="w-full h-full rounded-lg"
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