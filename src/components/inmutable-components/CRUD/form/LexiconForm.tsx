// LexiconForm.tsx (updated)
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/reusable-components/button';
import { Input } from '@/components/reusable-components/input';
import { Label } from '@/components/reusable-components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/reusable-components/select';
import { Volume2, Search, Loader2, BookOpen, Info } from 'lucide-react';
import { LexiconUnit } from '@/pages/Admin/LexiconCRUD';
import { lexiconApi, Language } from '@/api/lexiconApi';
import { dictionaryApi, DictionaryResponse, dictionaryHelpers } from '@/api/dictionaryApi';

// Remove duplicate interface since we're importing from lexiconApi

interface LexiconFormProps {
  onSubmit: (data: Omit<LexiconUnit, 'id'>) => void;
  initialData?: LexiconUnit;
  type: 'units' | 'phrases';
  units: LexiconUnit[];
}

const LexiconForm: React.FC<LexiconFormProps> = ({ onSubmit, initialData, type, units }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  // Cờ tổng để bật/tắt toàn bộ tính năng dictionary
  const enableDictionary = false;
  const [formData, setFormData] = useState<any>({
    text: initialData?.text || '',
    ipa: initialData?.ipa || '',
    meaning_en: initialData?.meaning_en ||  '',
    image: initialData?.image || '',
    type: initialData?.type || (type === 'units' ? 'vocabulary' : 'phrase'),
    partOfSpeech: initialData?.partOfSpeech || '',
    language: initialData?.language || 'en',
    difficulty: initialData?.difficulty || 'beginner'
  });

  // Dictionary search states
  const [dictionarySuggestions, setDictionarySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingDictionary, setSearchingDictionary] = useState(false);
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const languagesResponse = await lexiconApi.languages.getAll();
        setLanguages(languagesResponse);
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Fallback to default languages if API fails
        setLanguages([
          { id: 1, name: 'Vietnamese', code: 'vi' },
          { id: 2, name: 'Thailand', code: 'th-TH' },
          { id: 3, name: 'Malaysia', code: 'ms-MY' },
          { id: 4, name: 'French', code: 'fr-FR' },
          { id: 5, name: 'China', code: 'zh-CN' },
          { id: 6, name: 'Vietnam', code: 'vi-VN' },
          { id: 7, name: 'Egypt', code: 'ar-EG' },
          { id: 8, name: 'Russia', code: 'ru-RU' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Dictionary search functions - chỉ hoạt động cho vocabulary (units)
  const handleTextInputChange = (value: string) => {
    console.log('🔍 handleTextInputChange called with:', value);
    setFormData({ ...formData, text: value });
    
    // Tắt toàn bộ dictionary khi flag off hoặc khi là phrases
    if (!enableDictionary || type === 'phrases') {
      setSearchQuery(value);
      return;
    }
    
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    if (value.length >= 2) {
      console.log('⏰ Setting timeout for search after 300ms...');
      searchTimeoutRef.current = setTimeout(() => {
        console.log('🚀 Timeout triggered, calling searchDictionarySuggestions...');
        searchDictionarySuggestions(value);
      }, 300);
    } else {
      console.log('❌ Input too short, hiding suggestions');
      setShowSuggestions(false);
      setDictionarySuggestions([]);
    }
  };

  const searchDictionarySuggestions = async (query: string) => {
    // Chỉ hoạt động khi bật dictionary và cho vocabulary
    if (!enableDictionary || type === 'phrases') return;
    
    console.log('🔎 searchDictionarySuggestions called with query:', query);
    console.log('🌍 Current language:', formData.language);
    console.log('📚 Available units:', units.length);

    try {
      setSearchingDictionary(true);

      // Normalize language code for Dictionary API (remove country suffix)
      // Database: en-US, fr-FR, zh-CN → Dictionary API: en, fr, zh
      const normalizedLanguage = dictionaryHelpers.normalizeLanguageCode(formData.language);
      console.log('🔧 Normalized language code:', normalizedLanguage, 'from:', formData.language);

      // Get suggestions from backend API
      let suggestions: string[] = [];
      try {
        console.log(`🔍 Calling backend suggestions API: /api/dictionary/suggest?lang=${normalizedLanguage}&query=${query}`);
        suggestions = await dictionaryHelpers.generateSuggestions(query, normalizedLanguage);
        console.log('📖 Dictionary suggestions from API:', suggestions);
      } catch (apiError: any) {
        console.log('⚠️ Backend suggestions failed, using local fallback:', {
          message: apiError?.message || 'Unknown error',
          status: apiError?.response?.status || 'No status',
          data: apiError?.response?.data || 'No data'
        });
        
        // Fallback to local suggestions
        console.log('🔄 Switching to local fallback suggestions...');
        suggestions = dictionaryHelpers.generateLocalSuggestions(query, normalizedLanguage);
        console.log('🏠 Local fallback suggestions:', suggestions);
      }

      // Also search in existing units for suggestions
      console.log(`🔍 Searching existing units for "${query}" in language "${formData.language}"...`);
      console.log(`📚 Total units available: ${units.length}`);
      
      const existingSuggestions = units
        .filter(unit => {
          const matchesText = unit.text.toLowerCase().includes(query.toLowerCase());
          const matchesLanguage = unit.language === formData.language;
          console.log(`  Unit: "${unit.text}" (${unit.language}) - Text match: ${matchesText}, Language match: ${matchesLanguage}`);
          return matchesText && matchesLanguage;
        })
        .map(unit => unit.text);
      console.log('🏠 Existing unit suggestions:', existingSuggestions);

      // Combine and deduplicate suggestions
      const allSuggestions = Array.from(new Set([...suggestions, ...existingSuggestions]));
      console.log('✨ Combined suggestions:', allSuggestions);

      setDictionarySuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      console.log('🎯 Final result - suggestions:', allSuggestions.length, 'showSuggestions:', allSuggestions.length > 0);
    } catch (error) {
      console.error('❌ Error searching dictionary suggestions:', error);
    } finally {
      setSearchingDictionary(false);
      console.log('✅ Search completed');
    }
  };

  const selectSuggestion = async (suggestion: string) => {
    // Chỉ hoạt động khi bật dictionary và cho vocabulary
    if (!enableDictionary || type === 'phrases') return;
    
    console.log('🎯 selectSuggestion called with:', suggestion);
    setFormData({ ...formData, text: suggestion });
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // Search for detailed information about the selected word
    await searchDictionaryWord(suggestion);
  };

  const searchDictionaryWord = async (word: string) => {
    // Chỉ hoạt động khi bật dictionary và cho vocabulary
    if (!enableDictionary || type === 'phrases') return;
    
    console.log('🔍 searchDictionaryWord called with:', word);
    console.log('🌍 Current language:', formData.language);
    console.log('📚 Available units:', units.length);

    try {
      setSearchingDictionary(true);

      // Check if the word exists in our lexicon first
      const existingUnit = units.find(unit =>
        unit.text.toLowerCase() === word.toLowerCase() &&
        unit.language === formData.language
      );

      console.log('🏠 Found existing unit:', existingUnit);

      if (existingUnit) {
        console.log('✅ Using existing unit data');
        // Use existing data
        setFormData({
          ...formData,
          text: existingUnit.text,
          ipa: existingUnit.ipa,
          meaning_en: existingUnit.meaning_en || '',
          partOfSpeech: existingUnit.partOfSpeech || '',
          type: existingUnit.type,
          difficulty: existingUnit.difficulty
        });
        setDictionaryResult(null);
        return;
      }

             // Try to get from external dictionary API
       // Normalize language code for Dictionary API (Database: en-US → API: en)
       const normalizedLanguage = dictionaryHelpers.normalizeLanguageCode(formData.language);
       console.log('🔧 Normalized language for API:', normalizedLanguage, 'from:', formData.language);
       
       if (dictionaryApi.isLanguageSupported(normalizedLanguage)) {
         console.log('🌐 Language supported, trying external API...');
         try {
           console.log(`📡 Calling: /api/dictionary?lang=${normalizedLanguage}&word=${word}`);
           const result = await dictionaryApi.searchByLanguage(normalizedLanguage, word);
           console.log('📡 External API result:', result);
           
           if (result && !result.error) {
             console.log('✅ API result is valid, setting dictionary result...');
             console.log('📝 Result details:', {
               word: result.word,
               pronunciation: result.pronunciation,
               meanings: result.meanings,
               partOfSpeech: result.partOfSpeech,
               language: result.language
             });
             
             setDictionaryResult(result);

             // Auto-fill form with dictionary data
             const updatedFormData = {
               ...formData,
               text: result.word,
               ipa: result.pronunciation || '',
               meaning_en: result.meanings && result.meanings.length > 0 ? result.meanings.join(', ') : '',
               partOfSpeech: result.partOfSpeech || '',
               type: 'vocabulary'
             };
             
             setFormData(updatedFormData);
             console.log('✅ Form auto-filled with dictionary data:', updatedFormData);
           } else {
             console.log('⚠️ API result has error or is invalid:', result);
           }
         } catch (apiError: any) {
           console.error('❌ External dictionary API error:', {
             message: apiError?.message || 'Unknown error',
             status: apiError?.response?.status || 'No status',
             data: apiError?.response?.data || 'No data',
             stack: apiError?.stack
           });
         }
       } else {
         console.log('❌ Language not supported by external API:', normalizedLanguage);
       }
    } catch (error) {
      console.error('❌ Error searching dictionary word:', error);
    } finally {
      setSearchingDictionary(false);
      console.log('✅ Word search completed');
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (field: 'image', file: File) => {
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, [field]: url });
  };

  const testTTS = async () => {
    try {
      console.log('🔊 Testing TTS with backend API...');
      console.log('📝 Text:', formData.text);
      console.log('🌍 Language:', formData.language);
      
      // Gọi backend TTS API
      const response = await fetch(`/api/tts/synthesize?text=${encodeURIComponent(formData.text)}&languageCode=${formData.language}`);
      
      if (response.ok) {
        const audioData = await response.text();
        console.log('✅ TTS API response received, length:', audioData.length);
        
        // Tạo audio element và phát
        const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
        audio.play().catch(error => {
          console.error('❌ Error playing audio:', error);
          // Fallback to browser TTS if backend fails
          fallbackToBrowserTTS();
        });
      } else {
        console.warn('⚠️ TTS API failed, falling back to browser TTS');
        fallbackToBrowserTTS();
      }
    } catch (error) {
      console.error('❌ TTS API error:', error);
      // Fallback to browser TTS
      fallbackToBrowserTTS();
    }
  };

  const fallbackToBrowserTTS = () => {
    console.log('🔄 Using browser TTS fallback...');
    // Dừng bất kỳ audio nào đang phát
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(formData.text);
    utterance.lang = formData.language || 'en-US';

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

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const posOptions = ['prefix', 'suffix', 'main verb', 'adjective', 'adverb', 'conjunction', 'preposition', 'article', 'pronoun', 'interjection'];

  // Debug logging for state changes
  console.log('🎭 LexiconForm render state:', {
    formData: formData.text,
    language: formData.language,
    dictionarySuggestions: dictionarySuggestions.length,
    showSuggestions,
    searchingDictionary,
    dictionaryResult: !!dictionaryResult
  });

  // Test API connection on mount - chỉ cho vocabulary
  useEffect(() => {
    if (!enableDictionary || type === 'phrases') return;
    
    const testAPI = async () => {
      try {
        console.log('🧪 Testing Dictionary API connection...');
        console.log('🌐 Base URL:', process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080');
        console.log('🔧 Supported languages:', dictionaryApi.getSupportedLanguages());

        // Test if current language is supported
        const isSupported = dictionaryApi.isLanguageSupported(formData.language);
        console.log('✅ Current language supported:', isSupported, formData.language);

        // Test API health (skip for now since backend doesn't have this endpoint)
        console.log('⚠️ Skipping health check - endpoint not implemented in backend yet');
        
        // Test if backend is reachable with a simple API call
        try {
          const testWord = 'hello';
          const testLang = dictionaryHelpers.normalizeLanguageCode(formData.language);
          console.log(`🧪 Testing backend connectivity with: /api/dictionary?lang=${testLang}&word=${testWord}`);
          
          const result = await dictionaryApi.searchByLanguage(testLang, testWord);
          console.log('✅ Backend is reachable:', result);
        } catch (apiError: any) {
          console.log('⚠️ Backend connectivity test failed:', {
            message: apiError?.message || 'Unknown error',
            status: apiError?.response?.status || 'No status',
            data: apiError?.response?.data || 'No data'
          });
        }

      } catch (error) {
        console.error('❌ API test failed:', error);
      }
    };

    testAPI();
  }, [formData.language, type, enableDictionary]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Label htmlFor="text">Text *</Label>
          <div className="relative">
            <Input
              id="text"
              value={formData.text}
              onChange={(e) => handleTextInputChange(e.target.value)}
              placeholder={type === 'phrases' ? "Enter phrase" : "Enter word or phrase"}
              required
              className="rounded-xl pr-10"
            />
            {/* Chỉ hiển thị dictionary features cho vocabulary */}
            {enableDictionary && type === 'units' && searchingDictionary && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
            )}
            {enableDictionary && type === 'units' && !searchingDictionary && formData.text && (
               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={() => searchDictionaryWord(formData.text)}
                   className="p-1 h-auto"
                   title="Search dictionary"
                 >
                   <Search className="w-4 h-4" />
                 </Button>
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={async () => {
                     console.log('🧪 Testing current word directly...');
                     console.log('📝 Current word:', formData.text);
                     console.log('🌍 Current language:', formData.language);
                     
                     try {
                       const normalizedLang = dictionaryHelpers.normalizeLanguageCode(formData.language);
                       console.log(`🔧 Normalized language: ${normalizedLang}`);
                       
                       const result = await dictionaryApi.searchByLanguage(normalizedLang, formData.text);
                       console.log('✅ Direct API result:', result);
                       
                       if (result && !result.error) {
                         setDictionaryResult(result);
                         console.log('✅ Dictionary result set successfully');
                       }
                     } catch (error: any) {
                       console.error('❌ Direct API test failed:', error);
                     }
                   }}
                   className="p-1 h-auto bg-blue-100 text-blue-600 hover:bg-blue-200"
                   title="Test current word"
                 >
                   🧪
                 </Button>
               </div>
             )}
          </div>

          {/* Dictionary Suggestions - chỉ cho vocabulary */}
          {enableDictionary && type === 'units' && showSuggestions && dictionarySuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            >
              {dictionarySuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {/* TTS button - chỉ cho vocabulary */}
            {type === 'units' && (
              <Button type="button" variant="outline" size="sm" onClick={testTTS} className="rounded-xl">
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
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

             {/* Dictionary Results Display - chỉ cho vocabulary */}
       {enableDictionary && type === 'units' && dictionaryResult && (
         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
           <div className="flex items-center gap-2 mb-3">
             <Info className="w-5 h-5 text-blue-600" />
             <h4 className="font-semibold text-blue-800">Dictionary Information</h4>
           </div>
           
           {/* Debug info */}
           <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
             <strong>Debug Info:</strong>
             <pre className="mt-1 text-xs overflow-auto">
               {JSON.stringify(dictionaryResult, null, 2)}
             </pre>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Word:</span>
              <span className="ml-2 text-gray-900">{dictionaryResult.word}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Pronunciation:</span>
              <span className="ml-2 text-gray-900">
                {dictionaryHelpers.formatPronunciation(dictionaryResult.pronunciation, dictionaryResult.language)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Part of Speech:</span>
              <span className="ml-2 text-gray-900">{dictionaryResult.partOfSpeech || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Language:</span>
              <span className="ml-2 text-gray-900">
                {dictionaryHelpers.getLanguageDisplayName(dictionaryResult.language)}
              </span>
            </div>
          </div>

          {dictionaryResult.meanings && dictionaryResult.meanings.length > 0 && (
            <div className="mt-3">
              <span className="font-medium text-gray-700">Meanings:</span>
              <div className="mt-1">
                {dictionaryResult.meanings.map((meaning, index) => (
                  <div key={index} className="text-gray-900">• {meaning}</div>
                ))}
              </div>
            </div>
          )}

          {dictionaryResult.examples && dictionaryResult.examples.length > 0 && (
            <div className="mt-3">
              <span className="font-medium text-gray-700">Examples:</span>
              <div className="mt-1">
                {dictionaryResult.examples.map((example, index) => (
                  <div key={index} className="text-gray-900 italic">"{example}"</div>
                ))}
              </div>
            </div>
          )}

          {/* Special fields for Japanese */}
          {dictionaryResult.language === 'ja' && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {dictionaryResult.kanji && (
                <div>
                  <span className="font-medium text-gray-700">Kanji:</span>
                  <span className="ml-2 text-gray-900">{dictionaryResult.kanji}</span>
                </div>
              )}
              {dictionaryResult.radicals && (
                <div>
                  <span className="font-medium text-gray-700">Radicals:</span>
                  <span className="ml-2 text-gray-900">{dictionaryResult.radicals}</span>
                </div>
              )}
              {dictionaryResult.strokeCount && (
                <div>
                  <span className="font-medium text-gray-700">Stroke Count:</span>
                  <span className="ml-2 text-gray-900">{dictionaryResult.strokeCount}</span>
                </div>
              )}
            </div>
          )}

          {/* Audio playback if available */}
          {dictionaryResult.audioUrl && (
            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const audio = new Audio(dictionaryResult.audioUrl);
                  audio.play().catch(console.error);
                }}
                className="rounded-xl"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Audio
              </Button>
            </div>
          )}
        </div>
      )}

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

        {dictionaryResult && enableDictionary && type === 'units' && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDictionaryResult(null);
              setFormData({
                ...formData,
                text: '',
                ipa: '',
                meaning_en: '',
                partOfSpeech: '',
                type: type === 'units' ? 'vocabulary' : 'phrase'
              });
            }}
            className="rounded-xl"
          >
            Clear Dictionary Data
          </Button>
        )}

        {/* Debug button - chỉ cho vocabulary */}
        {enableDictionary && type === 'units' && (
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                console.log('🧪 Dictionary API Debug Test');
                console.log('📝 Current form data:', formData);
                console.log('🌍 Current language:', formData.language);
                console.log('🔧 Normalized language:', dictionaryHelpers.normalizeLanguageCode(formData.language));
                console.log('✅ Language supported:', dictionaryApi.isLanguageSupported(dictionaryHelpers.normalizeLanguageCode(formData.language)));
                console.log('📚 Available languages:', dictionaryApi.getSupportedLanguages());
                console.log('🏠 Available units:', units.length);

                // Test suggestions with detailed logging
                const testQuery = 'nat';
                const normalizedLang = dictionaryHelpers.normalizeLanguageCode(formData.language);
                console.log(`\n🔍 Testing suggestions for "${testQuery}" in "${normalizedLang}"...`);
                
                try {
                  const testSuggestions = await dictionaryHelpers.generateSuggestions(testQuery, normalizedLang);
                  console.log('✅ API suggestions successful:', testSuggestions);
                } catch (apiError: any) {
                  console.log('⚠️ API suggestions failed:', {
                    message: apiError?.message || 'Unknown error',
                    status: apiError?.response?.status || 'No status',
                    data: apiError?.response?.data || 'No data'
                  });
                  
                  // Test fallback
                  console.log('🔄 Testing local fallback...');
                  const fallbackSuggestions = dictionaryHelpers.generateLocalSuggestions(testQuery, normalizedLang);
                  console.log('🏠 Local fallback suggestions:', fallbackSuggestions);
                }

                // Test Japanese word specifically
                if (formData.language === 'zh-CN') {
                  console.log(`\n🇯🇵 Testing Japanese word "リス" (Risu)...`);
                  try {
                    const japaneseResult = await dictionaryApi.searchByLanguage('ja', 'リス');
                    console.log('✅ Japanese API result:', japaneseResult);
                  } catch (japaneseError: any) {
                    console.log('⚠️ Japanese API failed:', {
                      message: japaneseError?.message || 'Unknown error',
                      status: japaneseError?.response?.status || 'No status',
                      data: japaneseError?.response?.data || 'No data'
                    });
                  }
                }

                // Test Dictionary search API
                console.log(`\n🌐 Testing Dictionary search API...`);
                const testWord = 'hello';
                const testLang = dictionaryHelpers.normalizeLanguageCode(formData.language);
                console.log(`📡 Calling: /api/dictionary?lang=${testLang}&word=${testWord}`);

                try {
                  const result = await dictionaryApi.searchByLanguage(testLang, testWord);
                  console.log('✅ Dictionary search successful:', result);
                } catch (apiError: any) {
                  console.error('❌ Dictionary search failed:', {
                    message: apiError?.message || 'Unknown error',
                    status: apiError?.response?.status || 'No status',
                    data: apiError?.response?.data || 'No data'
                  });
                }

              } catch (error) {
                console.error('❌ Debug test failed:', error);
              }
            }}
            className="rounded-xl bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            🧪 Debug Dictionary API
          </Button>
        )}
      </div>
    </form>
  );
};

export default LexiconForm;
