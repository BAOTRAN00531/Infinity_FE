import React, { useState } from 'react';
import { Button } from '@/components/reusable-components/button';
import { Input } from '@/components/reusable-components/input';
import { Label } from '@/components/reusable-components/label';
import { Textarea } from '@/components/reusable-components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { Badge } from '@/components/reusable-components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable-components/card';
import { Upload, Volume2, X, Plus } from 'lucide-react';
import { LexiconUnit, LexiconPhrase } from '@/pages/Admin/LexiconCRUD';

interface LexiconFormProps {
  onSubmit: (data: Omit<LexiconUnit | LexiconPhrase, 'id'>) => void;
  initialData?: LexiconUnit | LexiconPhrase;
  type: 'units' | 'phrases';
  units: LexiconUnit[];
}

const LexiconForm: React.FC<LexiconFormProps> = ({ onSubmit, initialData, type, units }) => {
  const [formData, setFormData] = useState<any>({
    text: initialData?.text || '',
    ipa: initialData?.ipa || '',
    meaning_vi: initialData?.meaning_vi || '',
    meaning_en: initialData?.meaning_en || '',
    audio: initialData?.audio || '',
    image: initialData?.image || '',
    type: initialData?.type || (type === 'units' ? 'noun' : 'greeting'),
    language: initialData?.language || 'en',
    difficulty: initialData?.difficulty || 'beginner',
    units: (initialData as LexiconPhrase)?.units || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (field: 'audio' | 'image', file: File) => {
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, [field]: url });
  };

  const testTTS = () => {
    const utterance = new SpeechSynthesisUtterance(formData.text);
    speechSynthesis.speak(utterance);
  };

  const addUnit = (unit: LexiconUnit) => {
    if (!formData.units.find((u: LexiconUnit) => u.id === unit.id)) {
      setFormData({ ...formData, units: [...formData.units, unit] });
    }
  };

  const removeUnit = (unitId: number) => {
    setFormData({ ...formData, units: formData.units.filter((u: LexiconUnit) => u.id !== unitId) });
  };

  const unitTypes = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'other'];
  const phraseTypes = ['greeting', 'conversation', 'grammar', 'idiom', 'other'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

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
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={testTTS}
              className="rounded-xl"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meaning_vi">Vietnamese Meaning *</Label>
          <Input
            id="meaning_vi"
            value={formData.meaning_vi}
            onChange={(e) => setFormData({ ...formData, meaning_vi: e.target.value })}
            placeholder="Nghĩa tiếng Việt"
            required
            className="rounded-xl"
          />
        </div>
        
        <div>
          <Label htmlFor="meaning_en">English Meaning</Label>
          <Input
            id="meaning_en"
            value={formData.meaning_en}
            onChange={(e) => setFormData({ ...formData, meaning_en: e.target.value })}
            placeholder="English explanation"
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(type === 'units' ? unitTypes : phraseTypes).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
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
                <SelectItem key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="audio">Audio File</Label>
          <div className="flex gap-2">
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('audio', file);
              }}
              className="rounded-xl"
            />
          </div>
          {formData.audio && (
            <audio controls className="w-full mt-2">
              <source src={formData.audio} type="audio/mpeg" />
            </audio>
          )}
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
      </div>

      {type === 'phrases' && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Phrase Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label>Add Words to Phrase</Label>
              <Select onValueChange={(value) => {
                const unit = units.find(u => u.id === parseInt(value));
                if (unit) addUnit(unit);
              }}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a word to add" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.text} - {unit.meaning_vi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.units.map((unit: LexiconUnit) => (
                <Badge key={unit.id} variant="secondary" className="flex items-center gap-1">
                  {unit.text}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUnit(unit.id)}
                    className="p-0 h-auto"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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