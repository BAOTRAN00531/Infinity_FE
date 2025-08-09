import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface LanguageFormProps {
    initialData?: Language;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

interface Language {
    code: string;
    name: string;
    flag: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    popularity: 'High' | 'Medium' | 'Low';
}

const LanguageForm: React.FC<LanguageFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [code, setCode] = useState(initialData?.code || '');
    const [name, setName] = useState(initialData?.name || '');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialData?.difficulty || 'Medium');
    const [popularity, setPopularity] = useState<'High' | 'Medium' | 'Low'>(initialData?.popularity || 'Medium');
    const [flag, setFlag] = useState(initialData?.flag || '');
    const [templates, setTemplates] = useState<{ name: string; code: string; flag: string }[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

        if (!token) {
            toast.error('Missing token. Please login.', { autoClose: 1200 });
            return;
        }

        (async () => {
            try {
                const res = await fetch('http://localhost:8080/api/language-templates', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await res.json();
                setTemplates(data);
            } catch (error) {
                toast.error('Failed to load templates', { autoClose: 1200 });
            }
        })();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('code', code);
        formData.append('name', name);
        formData.append('difficulty', difficulty);
        formData.append('popularity', popularity);
        formData.append('flag', flag);

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Code</label>
                <input
                    type="text"
                    value={code}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Name</label>
                <select
                    value={name}
                    onChange={(e) => {
                        const selected = templates.find(t => t.name === e.target.value);
                        setName(selected?.name || '');
                        setCode(selected?.code || '');
                        setFlag(selected?.flag || '');
                    }}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="">-- Select Language --</option>
                    {templates.map((t, idx) => (
                        <option key={idx} value={t.name}>{t.name}</option>
                    ))}
                </select>
            </div>

            {flag && (
                <div>
                    <label className="block mb-1 font-medium">Flag Preview</label>
                    <img src={flag} alt="flag" className="w-12 h-12 rounded-full border" />
                </div>
            )}

            <div>
                <label className="block mb-1 font-medium">Difficulty</label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full p-2 border rounded"
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Popularity</label>
                <select
                    value={popularity}
                    onChange={(e) => setPopularity(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full p-2 border rounded"
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default LanguageForm;
