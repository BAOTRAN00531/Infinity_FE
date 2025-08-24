import { useState, useEffect, useCallback } from 'react';

// Interface cho progress event từ ReactPlayer
export interface VideoProgress {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
}

export const useLessonLogic = (
    selectedLessonId: number | null,
    onMarkComplete: (lessonId: number) => void
) => {
    const [hasCompletedVideo, setHasCompletedVideo] = useState(false);
    const [videoProgress, setVideoProgress] = useState<VideoProgress>({
        played: 0,
        playedSeconds: 0,
        loaded: 0,
        loadedSeconds: 0
    });
    const [videoError, setVideoError] = useState<string | null>(null);

    // Reset trạng thái khi chuyển bài học
    useEffect(() => {
        setHasCompletedVideo(false);
        setVideoProgress({
            played: 0,
            playedSeconds: 0,
            loaded: 0,
            loadedSeconds: 0
        });
        setVideoError(null);
    }, [selectedLessonId]);

    // Kiểm tra URL hợp lệ
    const isValidVideoUrl = useCallback((url: string) => {
        if (!url || typeof url !== 'string') return false;

        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }, []);

    // Handle video progress với proper typing
    const handleVideoProgress = useCallback((progress: VideoProgress) => {
        setVideoProgress(progress);

        // Đánh dấu hoàn thành khi xem được 90% video
        if (!hasCompletedVideo && selectedLessonId && progress.played >= 0.9) {
            onMarkComplete(selectedLessonId);
            setHasCompletedVideo(true);
        }
    }, [hasCompletedVideo, selectedLessonId, onMarkComplete]);

    // Handle video error
    const handleVideoError = useCallback((error: any) => {
        console.error('Video error:', error);
        setVideoError('Không thể tải video. Vui lòng kiểm tra lại URL hoặc kết nối mạng.');
    }, []);

    // Utility functions
    const getProgressPercentage = () => Math.round(videoProgress.played * 100);
    const getWatchedTime = () => Math.floor(videoProgress.playedSeconds);
    const isNearlyCompleted = () => videoProgress.played >= 0.8;

    return {
        hasCompletedVideo,
        handleVideoProgress,
        videoProgress,
        videoError,
        handleVideoError,
        isValidVideoUrl,
        getProgressPercentage,
        getWatchedTime,
        isNearlyCompleted
    };
};