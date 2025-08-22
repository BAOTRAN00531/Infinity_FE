export {}
// // src/components/custom-video-player/CustomVideoPlayer.tsx
// import { useEffect, useRef } from 'react';
//
// interface CustomVideoPlayerProps {
//     videoUrl: string;
//     duration: string; // Định dạng "00:00:00" hoặc "00:00"
//     onProgress: (progress: number) => void;
//     onCompleted: () => void;
// }
//
// export const CustomVideoPlayer = ({
//                                       videoUrl,
//                                       duration,
//                                       onProgress,
//                                       onCompleted
//                                   }: CustomVideoPlayerProps) => {
//     const iframeRef = useRef<HTMLIFrameElement>(null);
//     const progressChecked = useRef(false);
//
//     // Chuyển đổi thời lượng từ string sang seconds
//     const convertDurationToSeconds = (duration: string): number => {
//         const parts = duration.split(':');
//         if (parts.length === 3) {
//             // Format: HH:MM:SS
//             return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
//         } else if (parts.length === 2) {
//             // Format: MM:SS
//             return parseInt(parts[0]) * 60 + parseInt(parts[1]);
//         }
//         return 0;
//     };
//
//     useEffect(() => {
//         const totalSeconds = convertDurationToSeconds(duration);
//         const completionThreshold = 0.9; // 90%
//
//         const handleMessage = (event: MessageEvent) => {
//             try {
//                 // Kiểm tra nếu message từ YouTube
//                 if (event.origin !== 'https://www.youtube.com') return;
//
//                 const data = JSON.parse(event.data);
//
//                 if (data.event === 'infoDelivery' && data.info && data.info.currentTime) {
//                     const currentTime = data.info.currentTime;
//                     const progress = currentTime / totalSeconds;
//
//                     onProgress(progress);
//
//                     // Kiểm tra nếu đã xem 90% và chưa được mark completed
//                     if (progress >= completionThreshold && !progressChecked.current) {
//                         progressChecked.current = true;
//                         onCompleted();
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error parsing YouTube message:', error);
//             }
//         };
//
//         window.addEventListener('message', handleMessage);
//
//         return () => {
//             window.removeEventListener('message', handleMessage);
//         };
//     }, [duration, onProgress, onCompleted]);
//
//     return (
//         <div className="aspect-video mb-6">
//             <iframe
//                 ref={iframeRef}
//                 src={`${videoUrl}?enablejsapi=1`} // Thêm enablejsapi=1 để bật JavaScript API
//                 className="w-full h-full rounded-lg"
//                 allowFullScreen
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             />
//         </div>
//     );
// };