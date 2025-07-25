import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, Volume2 } from 'lucide-react';
import { Button } from '@/components/reusable-components/button';
import { Input } from '@/components/reusable-components/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/reusable-components/dialog';
import { Badge } from '@/components/reusable-components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/reusable-components/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/reusable-components/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/reusable-components/avatar';
import LexiconForm from '@/components/inmutable-components/CRUD/form/LexiconForm';
import LexiconDetails from '@/components/inmutable-components/CRUD/detail/LexiconDetails';
import DeleteConfirmation from '@/components/inmutable-components/DeleteConfirmation';

export interface LexiconUnit {
  id: number;
  text: string;
  ipa: string;
  meaning_vi: string;
  meaning_en?: string;
  audio?: string;
  image?: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'other';
  language: 'en' | 'ja' | 'ko' | 'zh' | 'es' | 'fr';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LexiconPhrase {
  id: number;
  text: string;
  ipa: string;
  meaning_vi: string;
  meaning_en?: string;
  audio?: string;
  image?: string;
  units: LexiconUnit[];
  type: 'greeting' | 'conversation' | 'grammar' | 'idiom' | 'other';
  language: 'en' | 'ja' | 'ko' | 'zh' | 'es' | 'fr';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const LexiconCRUD = () => {
  const [units, setUnits] = useState<LexiconUnit[]>([
    {
      id: 1,
      text: 'Hello',
      ipa: '/həˈloʊ/',
      meaning_vi: 'Xin chào',
      meaning_en: 'A greeting',
      type: 'noun',
      language: 'en',
      difficulty: 'beginner'
    },
    {
      id: 2,
      text: 'お茶',
      ipa: '/oˈtʃa/',
      meaning_vi: 'Trà',
      meaning_en: 'Tea',
      type: 'noun',
      language: 'ja',
      difficulty: 'beginner'
    }
  ]);

  const [phrases, setPhrases] = useState<LexiconPhrase[]>([
    {
      id: 1,
      text: 'How are you?',
      ipa: '/haʊ ɑr ju/',
      meaning_vi: 'Bạn có khỏe không?',
      meaning_en: 'A common greeting question',
      units: [units[0]],
      type: 'greeting',
      language: 'en',
      difficulty: 'beginner'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<LexiconUnit | LexiconPhrase | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('units');

  const filteredUnits = units.filter(unit =>
    unit.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.ipa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.meaning_vi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPhrases = phrases.filter(phrase =>
    phrase.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.ipa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.meaning_vi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: Omit<LexiconUnit | LexiconPhrase, 'id'>) => {
    if (activeTab === 'units') {
      const newUnit = { ...data, id: Math.max(...units.map(u => u.id)) + 1 } as LexiconUnit;
      setUnits([...units, newUnit]);
    } else {
      const newPhrase = { ...data, id: Math.max(...phrases.map(p => p.id)) + 1 } as LexiconPhrase;
      setPhrases([...phrases, newPhrase]);
    }
    setIsCreateOpen(false);
  };

  const handleUpdate = (data: Omit<LexiconUnit | LexiconPhrase, 'id'>) => {
    if (selectedItem) {
      if (activeTab === 'units') {
        setUnits(units.map(unit => 
          unit.id === selectedItem.id ? { ...data, id: selectedItem.id } as LexiconUnit : unit
        ));
      } else {
        setPhrases(phrases.map(phrase => 
          phrase.id === selectedItem.id ? { ...data, id: selectedItem.id } as LexiconPhrase : phrase
        ));
      }
      setIsEditOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      if (activeTab === 'units') {
        setUnits(units.filter(unit => unit.id !== selectedItem.id));
      } else {
        setPhrases(phrases.filter(phrase => phrase.id !== selectedItem.id));
      }
      setIsDeleteOpen(false);
      setSelectedItem(null);
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

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      // Fallback to TTS
      const utterance = new SpeechSynthesisUtterance(selectedItem?.text || '');
      speechSynthesis.speak(utterance);
    }
  };

  const LexiconCard = ({ item, type }: { item: LexiconUnit | LexiconPhrase, type: 'unit' | 'phrase' }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center gap-2 mb-3">
        <Badge className="text-xs bg-blue-100 text-blue-800">
          {item.language.toUpperCase()}
        </Badge>
        <Badge className="text-xs bg-purple-100 text-purple-800">
          {item.type}
        </Badge>
        <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
          {item.difficulty}
        </Badge>
      </div>
      
      <div className="mb-3">
        <HoverCard>
          <HoverCardTrigger asChild>
            <h3 className="text-lg font-black text-gray-800 mb-1 cursor-pointer hover:text-blue-600">
              {item.text}
            </h3>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-bold">{item.text}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => playAudio(item.audio)}
                  className="p-1"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">IPA: {item.ipa}</p>
              <p className="text-sm">{item.meaning_vi}</p>
              {item.meaning_en && <p className="text-xs text-gray-500">{item.meaning_en}</p>}
              {item.image && (
                <Avatar className="w-16 h-16">
                  <AvatarImage src={item.image} alt={item.text} />
                  <AvatarFallback>{item.text.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        <p className="text-sm text-gray-600 mb-1">IPA: {item.ipa}</p>
        <p className="text-sm text-gray-700">{item.meaning_vi}</p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl hover:bg-green-100"
          onClick={() => playAudio(item.audio)}
        >
          <Volume2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl hover:bg-blue-100"
          onClick={() => {
            setSelectedItem(item);
            setIsViewOpen(true);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl hover:bg-yellow-100"
          onClick={() => {
            setSelectedItem(item);
            setIsEditOpen(true);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl hover:bg-red-100 text-red-500"
          onClick={() => {
            setSelectedItem(item);
            setIsDeleteOpen(true);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">Lexicon Management</h2>
            <p className="text-gray-600">Manage vocabulary and phrases dictionary</p>
          </div>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Add {activeTab === 'units' ? 'Word' : 'Phrase'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-800">
                Create New {activeTab === 'units' ? 'Word' : 'Phrase'}
              </DialogTitle>
            </DialogHeader>
            <LexiconForm 
              onSubmit={handleCreate} 
              type={activeTab as 'units' | 'phrases'}
              units={units}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by text, pronunciation, or meaning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl">
          <TabsTrigger value="units" className="rounded-xl">Vocabulary</TabsTrigger>
          <TabsTrigger value="phrases" className="rounded-xl">Phrases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="units" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <LexiconCard key={unit.id} item={unit} type="unit" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="phrases" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPhrases.map((phrase) => (
              <LexiconCard key={phrase.id} item={phrase} type="phrase" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">
              Edit {activeTab === 'units' ? 'Word' : 'Phrase'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <LexiconForm
              initialData={selectedItem}
              onSubmit={handleUpdate}
              type={activeTab as 'units' | 'phrases'}
              units={units}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">
              {activeTab === 'units' ? 'Word' : 'Phrase'} Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && <LexiconDetails item={selectedItem} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-800">
              Delete {activeTab === 'units' ? 'Word' : 'Phrase'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <DeleteConfirmation
              userName={selectedItem.text}
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LexiconCRUD;