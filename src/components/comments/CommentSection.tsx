// components/comments/CommentSection.tsx
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
    name: string;
    content: string;
    rating: number;
    createdAt: string;
}

export function CommentSection({ courseId }: { courseId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!name || !content || rating === 0) return;

        setLoading(true);
        setTimeout(() => {
            const newComment = {
                name,
                content,
                rating,
                createdAt: new Date().toISOString(),
            };
            setComments([newComment, ...comments]);
            setName("");
            setContent("");
            setRating(0);
            setLoading(false);
        }, 800); // Mock delay
    };

    return (
        <div className="mt-10 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                💬 Đánh giá & Bình luận
            </h3>

            {/* Form */}
            <div className="space-y-2 mb-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên của bạn"
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                />
                <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Bình luận của bạn..."
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            size={20}
                            onClick={() => setRating(i)}
                            className={cn("cursor-pointer", {
                                "text-yellow-400": i <= rating,
                                "text-gray-400": i > rating,
                            })}
                            fill={i <= rating ? "currentColor" : "none"}
                        />
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </div>

            {/* Danh sách bình luận */}
            {comments.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((cmt, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700"
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold">{cmt.name}</span>
                                <div className="flex gap-1 text-yellow-400">
                                    {[...Array(cmt.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{cmt.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
