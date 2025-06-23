
import React, { useState } from 'react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Label } from '@/components/reusable-components/label';
import { Textarea } from '@/components/reusable-components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text-input';
  partId: number;
  partName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (data: Omit<Question, 'id'>) => void;
}

const QuestionForm = ({ initialData, onSubmit }: QuestionFormProps) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    type: initialData?.type || 'multiple-choice' as const,
    partId: initialData?.partId || 1,
    partName: initialData?.partName || 'Common Phrases Practice',
    difficulty: initialData?.difficulty || 'easy' as const,
    points: initialData?.points || 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
      <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
      >
      <div className="space-y-2">
        <Label className="text-sm font-bold text-gray-700">Question</Label>
        <Textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="rounded-2xl border-2 border-gray-200 focus:border-orange-400"
          placeholder="Enter your question here..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Type</Label>
          <Select value={formData.type} onValueChange={(value: 'multiple-choice' | 'text-input') => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="text-input">Text Input</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Part</Label>
          <Select value={formData.partName} onValueChange={(value: string) => setFormData({ ...formData, partName: value })}>
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="Introduction to Greetings">Introduction to Greetings</SelectItem>
              <SelectItem value="Common Phrases Practice">Common Phrases Practice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({ ...formData, difficulty: value })}>
            <SelectTrigger className="rounded-2xl border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Points</Label>
          <Input_admin
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
            className="rounded-2xl border-2 border-gray-200 focus:border-orange-400"
            min="1"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button_admin
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {initialData ? 'Update Question' : 'Create Question'}
        </Button_admin>
      </div>
      </motion.form>
  );
};

export default QuestionForm;
