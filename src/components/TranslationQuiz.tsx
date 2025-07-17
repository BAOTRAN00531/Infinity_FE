
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  text: string;
}

const TranslationQuiz = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const correctAnswer = "Nước và cà phê";
  
  const options: Option[] = [
    { id: "1", text: "Nước" },
    { id: "2", text: "và" },
    { id: "3", text: "cà" },
    { id: "4", text: "phê" }
  ];

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, text: string) => {
    e.dataTransfer.setData('text/plain', text);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!showFeedback) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (showFeedback) return;
    
    const text = e.dataTransfer.getData('text/plain');
    if (!selectedOptions.includes(text)) {
      const newSelectedOptions = [...selectedOptions, text];
      setSelectedOptions(newSelectedOptions);
      setUserInput(newSelectedOptions.join(" "));
    }
    setIsDraggingOver(false);
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
  };

  const handleSubmit = () => {
    const trimmedAnswer = userInput.trim();
    
    if (trimmedAnswer === correctAnswer) {
      setFeedback("✔️ Giỏi quá!!!");
      setIsCorrect(true);
    } else {
      setFeedback(`❌ Đáp án đúng: ${correctAnswer}`);
      setIsCorrect(false);
    }
    
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedOptions([]);
    setUserInput('');
    setShowFeedback(false);
    setFeedback('');
    setIsCorrect(false);
    setIsDraggingOver(false);
  };

  const getOptionStyles = (text: string) => {
    const baseStyles = "inline-block mx-1 my-1 px-4 py-2 font-mono text-base rounded-xl transition-all duration-150 ease-in-out transform active:translate-y-0.5 hover:shadow-lg cursor-move";
    
    if (!showFeedback) {
      return cn(
        baseStyles,
        "bg-quiz-choice shadow-[0_4px_0_hsl(var(--quiz-choice-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-choice-shadow))]",
        selectedOptions.includes(text) && "bg-quiz-selected border-2 border-foreground"
      );
    }

    if (isCorrect && selectedOptions.includes(text)) {
      return cn(
        baseStyles,
        "bg-quiz-correct shadow-[0_4px_0_hsl(var(--quiz-correct-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-correct-shadow))]"
      );
    } else if (!isCorrect && selectedOptions.includes(text)) {
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
          Viết lại bằng Tiếng Việt
        </h1>

        {/* Options */}
        <div className="mb-8 text-center">
          {options.map((option) => (
            <button
              key={option.id}
              draggable={!showFeedback}
              onDragStart={(e) => handleDragStart(e, option.text)}
              onClick={() => {
                if (!showFeedback) {
                  if (!selectedOptions.includes(option.text)) {
                    const newSelectedOptions = [...selectedOptions, option.text];
                    setSelectedOptions(newSelectedOptions);
                    setUserInput(newSelectedOptions.join(" "));
                  }
                }
              }}
              className={getOptionStyles(option.text)}
              disabled={showFeedback}
            >
              {option.text}
            </button>
          ))}
        </div>

        {/* Input Area (Drop Zone) */}
        <div
          className={cn(
            "mb-8 transition-all duration-150",
            isDraggingOver && "border-2 border-dashed border-foreground/50 rounded-lg p-2"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            type="text"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Kéo thả hoặc nhập câu trả lời"
            className="w-full max-w-sm mx-auto font-mono text-base"
            disabled={showFeedback}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <Button
            onClick={handleSubmit}
            disabled={!userInput || showFeedback}
            className="px-8 py-3 text-base font-mono"
          >
            Submit
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8 py-3 text-base font-mono"
          >
            {showFeedback ? 'Next' : 'Skip'}
          </Button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center text-xl font-bold text-foreground animate-in fade-in-50 duration-300">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationQuiz;