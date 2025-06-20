
import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { HelpCircle, FileText, Star, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'text-input';
  partId: number;
  partName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface QuestionDetailsProps {
  question: Question;
}

const QuestionDetails = ({ question }: QuestionDetailsProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="text-xs bg-purple-100 text-purple-800">
            {question.type}
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">{question.question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Part</p>
              <p className="font-bold text-gray-800">{question.partName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Type</p>
              <p className="font-bold text-gray-800">{question.type}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
            <Target className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Difficulty</p>
              <p className="font-bold text-gray-800 capitalize">{question.difficulty}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
            <Star className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Points</p>
              <p className="font-bold text-gray-800">{question.points} pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
