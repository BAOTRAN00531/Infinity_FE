import React, { useState } from 'react';
import { Button_admin } from '@/components/reusable-components/button_admin';
import { Input_admin } from '@/components/reusable-components/input_admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import { ScrollArea } from '@/components/reusable-components/scroll-area';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/reusable-components/hover-card';
import { Search, Volume2, BookOpen } from 'lucide-react';
import { LexiconUnit } from '@/pages/Admin/LexiconCRUD';

interface WordSuggestionProps {
  units: LexiconUnit[];
  phrases: LexiconUnit[];
  onSelect: (item: LexiconUnit) => void;
  placeholder?: string;
}

const WordSuggestion: React.FC<WordSuggestionProps> = ({ units = [], phrases = [], onSelect, placeholder = "Suggest words/phrases" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'words' | 'phrases'>('words');

  const allItems: LexiconUnit[] = activeTab === 'words' ? units : phrases;
  
  const filteredItems = allItems.filter((item: LexiconUnit) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.ipa && item.ipa.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.meaning_en && item.meaning_en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (item: LexiconUnit) => {
    onSelect(item);
    setSearchTerm('');
  };

  const playAudio = (item: LexiconUnit, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const WordHoverCard = ({ item }: { item: LexiconUnit }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          className="bg-white rounded-xl p-3 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md"
          onClick={() => handleSelect(item)}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-800">{item.text}</h4>
            <div className="flex items-center gap-1">
              <Button_admin
                variant="ghost" 
                size="sm"
                onClick={(e) => playAudio(item, e)}
                className="p-1 h-6 w-6"
              >
                <Volume2 className="w-3 h-3" />
              </Button_admin>
              <Badge className="text-xs bg-blue-100 text-blue-800">
                {getSafeLanguage(item.language)}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">IPA: {item.ipa}</p>
          <p className="text-sm text-gray-700">{item.meaning_en}</p>
          <div className="flex gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {item.type}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}> 
              {item.difficulty}
            </Badge>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">{item.text}</h4>
            <Button_admin 
              variant="ghost" 
              size="sm"
              onClick={() => playAudio(item, {} as React.MouseEvent)}
              className="p-1"
            >
              <Volume2 className="w-4 h-4" />
            </Button_admin>
          </div>
          <p className="text-sm text-gray-600">IPA: {item.ipa}</p>
          <p className="font-semibold text-blue-600">{item.meaning_en}</p>
          {item.meaning_en && <p className="text-sm text-gray-500">{item.meaning_en}</p>}
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input_admin
          placeholder="Search by text, pronunciation, or meaning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-xl border-2 border-gray-200 focus:border-blue-400"
        />
      </div>
      {/* Tabs */}
      <div className="flex gap-2">
        <Button_admin
          variant={activeTab === 'words' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('words')}
          className="rounded-xl"
        >
          Words ({units.length})
        </Button_admin>
        <Button_admin
          variant={activeTab === 'phrases' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('phrases')}
          className="rounded-xl"
        >
          Phrases ({phrases.length})
        </Button_admin>
      </div>
      {/* Results */}
      <ScrollArea className="h-96">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
          {filteredItems.map((item: LexiconUnit) => (
            <WordHoverCard key={item.id} item={item} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No {activeTab} found matching "{searchTerm}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WordSuggestion;