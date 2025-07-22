import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { Globe, BookOpen, TrendingUp, Award } from 'lucide-react';

interface Language {
  id: number;
  name: string;
  code: string;
  flag: string;
  coursesCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  popularity?: 'High' | 'Medium' | 'Low';
}

interface LanguageDetailsProps {
  language: Language;
}

const LanguageDetails: React.FC<LanguageDetailsProps> = ({ language }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-purple-100 text-purple-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center">
          <img alt="Flag" className="w-10 h-10 rounded-full mx-auto" src={language.flag}/>
          {/*<div className="text-6xl mb-4">{language.flag}</div>*/}
          <h3 className="text-3xl font-black text-gray-800 mb-2">{language.name}</h3>
          <p className="text-lg text-gray-600 uppercase tracking-wider">{language.code}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="font-bold text-gray-800">{language.coursesCount || 0} available</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
              <Award className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Difficulty</p>
                <Badge className={`text-xs ${getDifficultyColor(language.difficulty || 'Medium')}`}>
                  {language.difficulty || 'Medium'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Popularity</p>
                <Badge className={`text-xs ${getPopularityColor(language.popularity || 'Medium')}`}>
                  {language.popularity || 'Medium'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
              <Globe className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Language Code</p>
                <p className="font-bold text-gray-800">{language.code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LanguageDetails;