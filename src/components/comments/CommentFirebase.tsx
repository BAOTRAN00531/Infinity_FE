import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface Comment {
    id: string;
    text: string;
    user: string;
    rating: number;
    timestamp: number;
    avatarUrl?: string;
}

interface Props {
    courseId: string;
    userName: string;
    userAvatarUrl?: string;
}

export const CommentFirebase: React.FC<Props> = ({ courseId, userName, userAvatarUrl }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [filter, setFilter] = useState<"newest" | "oldest">("newest");
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        const q = query(
            collection(db, "comments", courseId, "courseComments"),
            orderBy("timestamp", filter === "newest" ? "desc" : "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Comment, "id">),
            }));
            setComments(commentList.filter((c) => c.rating >= minRating));
        });

        return () => unsubscribe();
    }, [courseId, filter, minRating]);

    return (
        <div className="mt-10 space-y-6 max-w-2xl mx-auto px-4">
            {/* Form nhập bình luận */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">✍️ Viết bình luận</h3>
                <CommentForm courseId={courseId} userName={userName} userAvatarUrl={userAvatarUrl} />
            </section>

            {/* Hiển thị bình luận */}
            <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">💬 Bình luận học viên</h3>
                    <div className="flex flex-col sm:flex-row gap-3 text-sm">
                        <label className={"dark:text-white"}>
                            Sắp xếp:
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as "newest" | "oldest")}
                                className="ml-2 p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                        </label>
                        <label className={"dark:text-white"}>
                            Lọc đánh giá:
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="ml-2 p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {[0, 1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                        {r}★
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <CommentList
                    comments={comments}
                    currentUser={userName}
                    onUpdate={(id, newText, newRating) =>
                        updateDoc(doc(db, "comments", courseId, "courseComments", id), {
                            text: newText,
                            rating: newRating,
                        })
                    }
                    onDelete={(id) =>
                        deleteDoc(doc(db, "comments", courseId, "courseComments", id))
                    }
                />
            </section>
        </div>
    );
};
