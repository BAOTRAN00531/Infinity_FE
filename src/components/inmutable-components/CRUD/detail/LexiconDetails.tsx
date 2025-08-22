import React from 'react';
import { Badge } from '@/components/reusable-components/badge';
import { Button } from '@/components/reusable-components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reusable-components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/reusable-components/avatar';
import { Volume2, Image as ImageIcon } from 'lucide-react';
import { LexiconUnit } from '@/pages/Admin/LexiconCRUD';

interface LexiconDetailsProps {
  item: LexiconUnit;
}

const LexiconDetails: React.FC<LexiconDetailsProps> = ({ item }) => {
  const playAudio = () => {
    if (item.audio) {
      const audio = new Audio(item.audio);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // Fallback to TTS
        playTTSWithLanguage(item.text, item.language);
      });
    } else {
      playTTSWithLanguage(item.text, item.language);
    }
  };

  // Hàm TTS với ngôn ngữ phù hợp
  const playTTSWithLanguage = (text: string, language: string) => {
    // Dừng bất kỳ audio nào đang phát
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Thiết lập ngôn ngữ dựa trên language code từ database
    const languageMap: { [key: string]: string } = {
      'vi': 'vi-VN',
      'th-TH': 'th-TH', 
      'ms-MY': 'ms-MY',
      'fr-FR': 'fr-FR',
      'zh-CN': 'zh-CN',
      'vi-VN': 'vi-VN',
      'ar-EG': 'ar-EG',
      'ru-RU': 'ru-RU',
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'es': 'es-ES'
    };

    // Sử dụng language code từ database hoặc fallback
    utterance.lang = languageMap[language] || language || 'en-US';
    
    // Hàm để tìm và thiết lập voice
    const findAndSetVoice = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Tìm giọng đọc phù hợp với ngôn ngữ
      const preferredVoice = voices.find(voice => {
        // Kiểm tra exact match trước
        if (voice.lang === utterance.lang) return true;
        
        // Kiểm tra language code base (trước dấu -)
        const baseLang = utterance.lang.split('-')[0];
        const voiceBaseLang = voice.lang.split('-')[0];
        return voiceBaseLang === baseLang;
      });
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using voice: ${preferredVoice.name} for language: ${utterance.lang}`);
      } else {
        console.warn(`No suitable voice found for language: ${utterance.lang}`);
        // Fallback to first available voice
        if (voices.length > 0) {
          utterance.voice = voices[0];
          console.log(`Fallback to voice: ${voices[0].name}`);
        }
      }

      // Thiết lập tốc độ và pitch phù hợp
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      speechSynthesis.speak(utterance);
    };

    // Kiểm tra xem voices đã được load chưa
    if (speechSynthesis.getVoices().length > 0) {
      findAndSetVoice();
    } else {
      // Đợi voices được load
      speechSynthesis.onvoiceschanged = () => {
        findAndSetVoice();
        // Remove listener sau khi sử dụng
        speechSynthesis.onvoiceschanged = null;
      };
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

  // Helper function để xử lý language an toàn
  const getSafeLanguage = (language: any): string => {
    if (!language) return 'EN';
    if (typeof language === 'string') return language.toUpperCase();
    if (typeof language === 'object' && language.code) return language.code.toUpperCase();
    if (typeof language === 'object' && language.name) return language.name.toUpperCase();
    return 'EN';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">{item.text}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800">
              {getSafeLanguage(item.language)}
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
          
          {item.meaning_en && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Meaning</h4>
              <p className="text-lg">{item.meaning_en}</p>
            </div>
          )}
          
          {item.partOfSpeech && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Part of Speech</h4>
              <p className="text-lg capitalize">{item.partOfSpeech}</p>
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

      {/* Usage Information */}
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
              <p>{item.type === 'vocabulary' ? 'Word' : 'Phrase'}</p>
            </div>
            {item.partOfSpeech && (
              <div>
                <span className="font-semibold text-gray-700">Part of Speech:</span>
                <p className="capitalize">{item.partOfSpeech}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LexiconDetails;