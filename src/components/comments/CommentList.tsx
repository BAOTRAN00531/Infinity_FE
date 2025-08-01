import React, { useState } from "react";
import { Star } from "lucide-react";

interface Comment {
    id: string;
    text: string;
    rating: number;
    user: string;
    timestamp: number;
    avatarUrl?: string;
}

interface Props {
    comments: Comment[];
    currentUser: string;
    onUpdate: (id: string, text: string, rating: number) => void;
    onDelete: (id: string) => void;
}

export const CommentList: React.FC<Props> = ({
                                                 comments,
                                                 currentUser,
                                                 onUpdate,
                                                 onDelete,
                                             }) => {
    const [editId, setEditId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(0);

    const startEdit = (c: Comment) => {
        setEditId(c.id);
        setEditText(c.text);
        setEditRating(c.rating);
    };

    const saveEdit = () => {
        if (editId && editText.trim() && editRating > 0) {
            onUpdate(editId, editText.trim(), editRating);
            setEditId(null);
        }
    };

    return (
        <div className="space-y-4">
            {comments.map((c) => (
                <div
                    key={c.id}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border dark:border-gray-700"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {c.avatarUrl ? (
                                <img src={c.avatarUrl} alt={`${c.user}'s avatar`} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                                    {c.user.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-medium text-gray-800 dark:text-white">{c.user}</span>
                        </div>
                        {c.user === currentUser && (
                            <div className="flex gap-2 text-sm text-blue-600 dark:text-blue-400">
                                <button onClick={() => startEdit(c)}>Sửa</button>
                                <button onClick={() => onDelete(c.id)}>Xoá</button>
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        {editId === c.id ? (
                            <>
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full rounded p-2 border bg-white dark:bg-gray-700 text-sm"
                />
                                <div className="mt-1 flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i <= editRating ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            onClick={() => setEditRating(i)}
                                            className="cursor-pointer text-yellow-400"
                                        />
                                    ))}
                                    <button onClick={saveEdit} className="ml-auto text-blue-600 dark:text-blue-400 text-sm">
                                        Lưu
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-1 text-yellow-400">{[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} fill={i <= c.rating ? "currentColor" : "none"} stroke="currentColor" />
                                ))}</div>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
