import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Star } from "lucide-react";

interface Props {
    courseId: string;
    userName: string;
    userAvatarUrl?: string;
}

export const CommentForm: React.FC<Props> = ({ courseId, userName, userAvatarUrl }) => {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || rating === 0 || loading) return;
        setLoading(true);
        try {
            await addDoc(collection(db, "comments", courseId, "courseComments"), {
                text: text.trim(),
                user: userName,
                rating,
                timestamp: Date.now(),
                ...(userAvatarUrl ? { avatarUrl: userAvatarUrl } : {}),
            });
            setText("");
            setRating(0);
        } catch (err) {
            console.error("Lỗi gửi:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
                {userAvatarUrl ? (
                    <img src={userAvatarUrl} className="w-10 h-10 rounded-full border" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {userName[0].toUpperCase()}
                    </div>
                )}
                <span className="font-medium text-gray-800 dark:text-gray-200">{userName}</span>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Viết bình luận..."
                rows={3}
                className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white text-sm resize-none"
            />

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Đánh giá:</span>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        size={20}
                        fill={i <= rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        onClick={() => setRating(i)}
                        className="cursor-pointer text-yellow-400 hover:scale-110 transition"
                    />
                ))}
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                disabled={loading || !text.trim() || rating === 0}
            >
                {loading ? "Đang gửi..." : "Gửi bình luận"}
            </button>
        </form>
    );
};
