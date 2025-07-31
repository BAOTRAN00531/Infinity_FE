// LexiconForm.tsx (updated)
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/reusable-components/button';
import { Input } from '@/components/reusable-components/input';
import { Label } from '@/components/reusable-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { Volume2 } from 'lucide-react';
import { LexiconUnit } from '@/pages/Admin/LexiconCRUD';
import axios from 'axios';

interface Language {
  id: number;
  name: string;
  code: string;
}

interface LexiconFormProps {
  onSubmit: (data: Omit<LexiconUnit, 'id'>) => void;
  initialData?: LexiconUnit;
  type: 'units' | 'phrases';
  units: LexiconUnit[];
}

const LexiconForm: React.FC<LexiconFormProps> = ({ onSubmit, initialData, type, units }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    text: initialData?.text || '',
    ipa: initialData?.ipa || '',
    meaning_en: initialData?.meaning_en || '',
    image: initialData?.image || '',
    type: initialData?.type || (type === 'units' ? 'vocabulary' : 'phrase'),
    partOfSpeech: initialData?.partOfSpeech || '',
    language: initialData?.language || 'en',
    difficulty: initialData?.difficulty || 'beginner'
  });

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) throw new Error("Token not found");

        const response = await axios.get(
          "http://localhost:8080/api/languages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Fallback to default languages if API fails
        setLanguages([
          { id: 1, name: 'English', code: 'en' },
          { id: 2, name: 'Japanese', code: 'ja' },
          { id: 3, name: 'Korean', code: 'ko' },
          { id: 4, name: 'Chinese', code: 'zh' },
          { id: 5, name: 'Spanish', code: 'es' },
          { id: 6, name: 'French', code: 'fr' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (field: 'image', file: File) => {
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, [field]: url });
  };

  const testTTS = () => {
    const utterance = new SpeechSynthesisUtterance(formData.text);
    speechSynthesis.speak(utterance);
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const posOptions = ['prefix', 'suffix', 'main verb', 'adjective', 'adverb', 'conjunction', 'preposition', 'article', 'pronoun', 'interjection'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="text">Text *</Label>
          <Input
            id="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter word or phrase"
            required
            className="rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="ipa">IPA Pronunciation</Label>
          <div className="flex gap-2">
            <Input
              id="ipa"
              value={formData.ipa}
              onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
              placeholder="/həˈloʊ/"
              className="rounded-xl"
            />
            <Button type="button" variant="outline" size="sm" onClick={testTTS} className="rounded-xl">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="meaning_en">Meaning</Label>
        <Input
          id="meaning_en"
          value={formData.meaning_en}
          onChange={(e) => setFormData({ ...formData, meaning_en: e.target.value })}
          placeholder="Enter meaning or explanation"
          className="rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="partOfSpeech">Part of Speech</Label>
        <Select
          value={formData.partOfSpeech}
          onValueChange={(value) => setFormData({ ...formData, partOfSpeech: value })}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select a role in sentence" />
          </SelectTrigger>
          <SelectContent>
            {posOptions.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vocabulary">Vocabulary</SelectItem>
              <SelectItem value="phrase">Phrase</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={loading ? "Loading languages..." : "Select language"} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image File</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload('image', file);
          }}
          className="rounded-xl"
        />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2" />
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-6 py-2 rounded-xl"
        >
          {initialData ? 'Update' : 'Create'} {type === 'units' ? 'Word' : 'Phrase'}
        </Button>
      </div>
    </form>
  );
};

export default LexiconForm;
