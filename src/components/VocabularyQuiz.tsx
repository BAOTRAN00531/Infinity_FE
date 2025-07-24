import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizData {
  word: string;
  choices: Choice[];
}

const VocabularyQuiz = () => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');

  const quizData: QuizData = {
    word: "Sữa",
    choices: [
      { id: "1", text: "Milk", isCorrect: true },
      { id: "2", text: "Sugar", isCorrect: false },
      { id: "3", text: "Tea", isCorrect: false }
    ]
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (showResult) return;
    setSelectedChoice(choiceId);
  };

  const handleSubmit = () => {
    if (!selectedChoice) return;
    
    const selectedChoiceData = quizData.choices.find(choice => choice.id === selectedChoice);
    if (selectedChoiceData?.isCorrect) {
      setFeedback("✔️ Giỏi quá!!!");
    } else {
      const correctAnswer = quizData.choices.find(choice => choice.isCorrect)?.text;
      setFeedback(`❌ Đáp án đúng: ${correctAnswer}`);
    }
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setShowResult(false);
    setFeedback('');
  };

  const getChoiceStyles = (choice: Choice) => {
    const baseStyles = "w-full max-w-sm mx-auto block mb-4 py-3 px-6 rounded-xl font-mono text-base transition-all duration-150 ease-in-out transform active:translate-y-1 hover:shadow-lg";
    
    if (!showResult) {
      return cn(
        baseStyles,
        "bg-quiz-choice shadow-[0_4px_0_hsl(var(--quiz-choice-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-choice-shadow))]",
        selectedChoice === choice.id && "bg-quiz-selected border-2 border-foreground"
      );
    }

    // Show results
    if (choice.isCorrect) {
      return cn(
        baseStyles,
        "bg-quiz-correct shadow-[0_4px_0_hsl(var(--quiz-correct-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-correct-shadow))]"
      );
    } else if (selectedChoice === choice.id && !choice.isCorrect) {
      return cn(
        baseStyles,
        "bg-quiz-wrong shadow-[0_4px_0_hsl(var(--quiz-wrong-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-wrong-shadow))] border-2 border-foreground"
      );
    }

    return cn(
      baseStyles,
      "bg-quiz-choice shadow-[0_4px_0_hsl(var(--quiz-choice-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-choice-shadow))]"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-quiz-choice/20 p-5">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Chọn nghĩa đúng
        </h1>
        
        {/* Word display */}
        <div className="flex justify-center items-center mb-8 gap-3">
          <span className="text-2xl">🔊</span>
          <div className="bg-quiz-word px-6 py-4 rounded-lg font-bold text-xl text-foreground">
            {quizData.word}
          </div>
        </div>

        {/* Choices */}
        <div className="mb-8">
          {quizData.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoiceSelect(choice.id)}
              className={getChoiceStyles(choice)}
              disabled={showResult}
            >
              {choice.text}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <Button
            onClick={handleSubmit}
            disabled={!selectedChoice || showResult}
            className="px-8 py-3 text-base font-mono"
          >
            Submit
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8 py-3 text-base font-mono"
          >
            {showResult ? 'Next' : 'Skip'}
          </Button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center text-xl font-bold text-foreground animate-in fade-in-50 duration-300">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyQuiz;