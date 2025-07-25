import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { Button } from '@/components/reusable-components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable-components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/reusable-components/avatar';
import { Volume2, Image as ImageIcon } from 'lucide-react';
import { LexiconUnit, LexiconPhrase } from '@/pages/Admin/LexiconCRUD';

interface LexiconDetailsProps {
  item: LexiconUnit | LexiconPhrase;
}

const LexiconDetails: React.FC<LexiconDetailsProps> = ({ item }) => {
  const isPhrase = 'units' in item;

  const playAudio = () => {
    if (item.audio) {
      const audio = new Audio(item.audio);
      audio.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(item.text);
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">{item.text}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800">
              {item.language.toUpperCase()}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {item.type}
            </Badge>
            <Badge className={getDifficultyColor(item.difficulty)}>
              {item.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={playAudio}
            className="rounded-xl"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Play
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">IPA Pronunciation</h4>
            <p className="text-lg font-mono bg-gray-50 p-2 rounded-xl">{item.ipa}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Vietnamese Meaning</h4>
            <p className="text-lg">{item.meaning_vi}</p>
          </div>
          
          {item.meaning_en && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">English Explanation</h4>
              <p className="text-gray-600">{item.meaning_en}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media */}
      {(item.audio || item.image) && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.audio && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Audio</h4>
                <audio controls className="w-full">
                  <source src={item.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {item.image && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Image</h4>
                <Avatar className="w-32 h-32">
                  <AvatarImage src={item.image} alt={item.text} />
                  <AvatarFallback className="text-2xl">
                    <ImageIcon className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phrase Components */}
      {isPhrase && (item as LexiconPhrase).units.length > 0 && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Phrase Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(item as LexiconPhrase).units.map((unit) => (
                <div key={unit.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-gray-800">{unit.text}</h5>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(unit.text);
                        speechSynthesis.speak(utterance);
                      }}
                      className="p-1"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">IPA: {unit.ipa}</p>
                  <p className="text-sm text-gray-700">{unit.meaning_vi}</p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {unit.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {unit.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Usage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Language:</span>
              <p className="capitalize">{item.language}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Type:</span>
              <p className="capitalize">{item.type}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Difficulty:</span>
              <p className="capitalize">{item.difficulty}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Category:</span>
              <p>{isPhrase ? 'Phrase' : 'Word'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LexiconDetails;