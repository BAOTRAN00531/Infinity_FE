import React from 'react';
import { UIQuestion } from '@/types';
import { Badge } from '@/components/reusable-components/badge';
import {
  AlignLeft,
  FileText,
  HelpCircle,
  ListChecks,
  Star,
  Target,
} from 'lucide-react';

interface Props {
  question: UIQuestion;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Nếu bạn muốn ánh xạ từ questionTypeId → tên loại câu hỏi
function getQuestionTypeName(typeId: number): string {
  switch (typeId) {
    case 1:
      return 'multiple-choice';
    case 2:
      return 'text-input';
    default:
      return 'unknown';
  }
}

const QuestionDetails = ({ question }: Props) => {
  const questionType = getQuestionTypeName(question.questionTypeId);

  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="text-xs bg-purple-100 text-purple-800">{questionType}</Badge>
            <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </Badge>
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">{question.questionText}</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Module ID</p>
                <p className="font-bold text-gray-800">{question.moduleId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="font-bold text-gray-800">{questionType}</p>
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

        {/* Danh sách Option hoặc Answer */}
        {questionType === 'multiple-choice' && question.options && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-gray-700">Options</h4>
              </div>
              <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                {question.options.map((opt, i) => (
                    <li
                        key={i}
                        className={opt.correct ? 'font-bold text-green-600' : ''}
                    >
                      {opt.optionText}
                    </li>
                ))}
              </ul>
            </div>
        )}

        {questionType === 'text-input' && question.answers && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-gray-700">Answers</h4>
              </div>
              <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
                {question.answers.map((ans, i) => (
                    <li
                        key={i}
                        className={ans.caseSensitive ? 'italic text-gray-800' : ''}
                    >
                      {ans.answerText}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default QuestionDetails;
