import React, { useState } from 'react';

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
    const [flagFile, setFlagFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('code', code);
        formData.append('name', name);
        formData.append('difficulty', difficulty);
        formData.append('popularity', popularity);
        if (flagFile) {
            formData.append('flag', flagFile);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Code</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

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

            <div>
                <label className="block mb-1 font-medium">Flag (image upload)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFlagFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border rounded"
                />
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
