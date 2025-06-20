import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface LanguageFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const LanguageForm: React.FC<LanguageFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [language, setLanguage] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    flag: initialData?.flag || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please log in as ADMIN');
      return;
    }

    try {
      if (initialData?.id) {
        // Update
        await axios.put(`http://localhost:8080/api/languages/${initialData.id}`, language, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Language updated successfully');
      } else {
        // Create
        await axios.post('http://localhost:8080/api/languages', language, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Language created successfully');
      }
      setLanguage({ code: '', name: '', flag: '' });
      onSubmit(language);
      if (onCancel) onCancel();
    } catch (error) {
      toast.error('Failed to save language. Ensure you have ADMIN rights.');
    }
  };

  return (
      <div>
        <h2>{initialData?.id ? 'Edit Language' : 'Create Language'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Code</label>
            <input
                type="text"
                value={language.code}
                onChange={(e) => setLanguage({ ...language, code: e.target.value })}
                required
            />
          </div>
          <div>
            <label>Name</label>
            <input
                type="text"
                value={language.name}
                onChange={(e) => setLanguage({ ...language, name: e.target.value })}
                required
            />
          </div>
          <div>
            <label>Flag</label>
            <input
                type="text"
                value={language.flag}
                onChange={(e) => setLanguage({ ...language, flag: e.target.value })}
                placeholder="e.g., 🇻🇳 or flags/vi.png"
                required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Save
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
            )}
          </div>
        </form>
      </div>
  );
};

export default LanguageForm;