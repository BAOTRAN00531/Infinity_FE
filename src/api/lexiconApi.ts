import api from '../api';

// Types for Lexicon API
export interface LexiconUnitDto {
  id?: number;
  text: string;
  ipa: string;
  meaningEn?: string;
  audio?: string;
  image?: string;
  type: 'vocabulary' | 'phrase';
  partOfSpeech?: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LexiconUnitResponse {
  id: number;
  text: string;
  ipa: string;
  meaningEn?: string;
  audio?: string;
  image?: string;
  type: 'vocabulary' | 'phrase';
  partOfSpeech?: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
  updatedAt?: string;
}

// TTS API Types
export interface Voice {
  name: string;
  languageCodes: string[];
  ssmlGender: string;
  naturalSampleRateHertz: number;
}

export interface TTSResponse {
  audioContent: string;
  audioUrl?: string;
}

// Lexicon Units API - Updated to match backend controller
export const lexiconUnitsApi = {
  // Get all units
  getAll: async (): Promise<{
    result: LexiconUnitResponse[];
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
  }> => {
    const response = await api.get('/api/lexicon/units');
    return response.data;
  },

  // Get vocabulary units
  getVocabulary: async (): Promise<{
    result: LexiconUnitResponse[];
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
  }> => {
    const response = await api.get('/api/lexicon/units');
    return response.data;
  },

  // Get phrases
  getPhrases: async (): Promise<{
    result: LexiconUnitResponse[];
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
  }> => {
    const response = await api.get('/api/lexicon/phrases');
    return response.data;
  },

  // Get by language
  getByLanguage: async (languageCode: string): Promise<LexiconUnitResponse[]> => {
    const response = await api.get(`/api/lexicon/language/${languageCode}`);
    return response.data;
  },

  // Get vocabulary by language
  getVocabularyByLanguage: async (languageCode: string): Promise<LexiconUnitResponse[]> => {
    const response = await api.get(`/api/lexicon/language/${languageCode}/units`);
    return response.data;
  },

  // Get phrases by language
  getPhrasesByLanguage: async (languageCode: string): Promise<LexiconUnitResponse[]> => {
    const response = await api.get(`/api/lexicon/language/${languageCode}/phrases`);
    return response.data;
  },

  // Create new unit
  create: async (unit: LexiconUnitDto, languageCode: string): Promise<LexiconUnitResponse> => {
    const response = await api.post(`/api/lexicon?languageCode=${languageCode}`, unit);
    return response.data;
  },

  // Update unit
  update: async (id: number, unit: LexiconUnitDto): Promise<LexiconUnitResponse> => {
    const response = await api.put(`/api/lexicon/${id}`, unit);
    return response.data;
  },

  // Delete unit
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/lexicon/${id}`);
  },

  // Generate audio for unit
  generateAudio: async (id: number): Promise<LexiconUnitResponse> => {
    const response = await api.post(`/api/lexicon/${id}/generate-audio`);
    return response.data;
  },

  // Generate audio with specific voice
  generateAudioWithVoice: async (id: number, voiceName: string): Promise<LexiconUnitResponse> => {
    const response = await api.post(`/api/lexicon/${id}/generate-audio-with-voice?voiceName=${voiceName}`);
    return response.data;
  },

  // Search units
  search: async (query: string, languageCode?: string, type?: string): Promise<LexiconUnitResponse[]> => {
    const params = new URLSearchParams({ q: query });
    if (languageCode) params.append('languageCode', languageCode);
    if (type) params.append('type', type);
    const response = await api.get(`/api/lexicon/search?${params.toString()}`);
    return response.data;
  },

  // Filter units
  filter: async (params: {
    partOfSpeech?: string;
    difficulty?: string;
    languageCode?: string;
    type?: string;
  }): Promise<LexiconUnitResponse[]> => {
    const response = await api.get('/api/lexicon/filter', { params });
    return response.data;
  },

  // Test endpoint
  test: async (): Promise<string> => {
    const response = await api.get('/api/lexicon/test');
    return response.data;
  },

  // Get test data
  getTestData: async (): Promise<LexiconUnitResponse[]> => {
    const response = await api.get('/api/lexicon/test-data');
    return response.data;
  }
};

// TTS API
export const ttsApi = {
  // Basic synthesis
  synthesize: async (text: string): Promise<string> => {
    const response = await api.get(`/api/tts?synthesize=${encodeURIComponent(text)}`);
    return response.data;
  },

  // Synthesize with language
  synthesizeWithLanguage: async (text: string, languageCode: string = 'en-US'): Promise<string> => {
    const response = await api.get(`/api/tts/synthesize?text=${encodeURIComponent(text)}&languageCode=${languageCode}`);
    return response.data;
  },

  // Synthesize with gender
  synthesizeWithGender: async (
    text: string, 
    languageCode: string = 'en-US', 
    gender: string = 'NEUTRAL'
  ): Promise<string> => {
    const response = await api.get(`/api/tts/synthesize-with-gender?text=${encodeURIComponent(text)}&languageCode=${languageCode}&gender=${gender}`);
    return response.data;
  },

  // Synthesize with specific voice
  synthesizeWithVoice: async (
    text: string, 
    languageCode: string = 'en-US', 
    voiceName: string
  ): Promise<string> => {
    const response = await api.get(`/api/tts/synthesize-with-voice?text=${encodeURIComponent(text)}&languageCode=${languageCode}&voiceName=${voiceName}`);
    return response.data;
  },

  // Get available voices
  getAvailableVoices: async (languageCode: string = 'en-US'): Promise<Voice[]> => {
    const response = await api.get(`/api/tts/voices?languageCode=${languageCode}`);
    return response.data;
  },

  // Get supported languages
  getSupportedLanguages: async (): Promise<Record<string, string>> => {
    const response = await api.get('/api/tts/supported-languages');
    return response.data;
  },

  // Get supported voices
  getSupportedVoices: async (): Promise<Record<string, string[]>> => {
    const response = await api.get('/api/tts/voices/supported');
    return response.data;
  },

  // Test lexicon TTS
  testLexiconTTS: async (text: string, languageCode: string): Promise<string> => {
    const response = await api.get(`/api/tts/test-lexicon?text=${encodeURIComponent(text)}&languageCode=${languageCode}`);
    return response.data;
  }
};

// Combined Lexicon API for convenience
export const lexiconApi = {
  units: lexiconUnitsApi,
  tts: ttsApi,
  
  // Get statistics
  getStats: async (): Promise<{
    totalUnits: number;
    totalPhrases: number;
    unitsByLanguage: Record<string, number>;
    phrasesByLanguage: Record<string, number>;
  }> => {
    const response = await api.get('/api/lexicon/stats');
    return response.data;
  }
};

export default lexiconApi; 