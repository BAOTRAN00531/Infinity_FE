import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';

const FillInBlankQuiz = () => {
    const [userInput, setUserInput] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const sentence = "Milk and tea";
    const displayText = "Milk______Tea";
    const correctAnswer = "and";

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }
    };

    const handleSubmit = () => {
        const trimmedAnswer = userInput.trim().toLowerCase();

        if (trimmedAnswer === correctAnswer.toLowerCase()) {
            setFeedback("✔️ Giỏi quá!!!");
            setIsCorrect(true);
        } else {
            setFeedback(`❌ Đáp án đúng: ${correctAnswer}`);
            setIsCorrect(false);
        }

        setShowFeedback(true);
    };

    const handleReset = () => {
        setUserInput('');
        setShowFeedback(false);
        setFeedback('');
        setIsCorrect(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-quiz-choice/20 p-5">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
                    Nhắp từ còn thiếu
                </h1>

                {/* Speaker button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleSpeak}
                        className="bg-muted border border-border rounded-lg p-4 hover:bg-muted/80 transition-colors"
                    >
                        <Volume2 className="h-8 w-8 text-muted-foreground" />
                    </button>
                </div>

                {/* Sentence with blank */}
                <div className="mb-8 flex justify-center">
                    <div className="bg-muted rounded-lg p-6 text-xl font-mono text-center text-foreground min-w-[300px]">
                        {displayText}
                    </div>
                </div>

                {/* Input for missing word */}
                <div className="mb-8 flex justify-center">
                    <Input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Nhập từ còn thiếu"
                        className="w-full max-w-sm mx-auto font-mono text-base text-center"
                        disabled={showFeedback}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="px-8 py-3 text-base font-mono bg-quiz-choice hover:bg-quiz-choice/80"
                    >
                        Skip
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!userInput || showFeedback}
                        className="px-8 py-3 text-base font-mono bg-quiz-choice hover:bg-quiz-choice/80"
                    >
                        Submit
                    </Button>
                </div>

                {/* Feedback */}
                {showFeedback && (
                    <div className={cn(
                        "text-center text-xl font-bold animate-in fade-in-50 duration-300",
                        isCorrect ? "text-quiz-correct" : "text-quiz-wrong"
                    )}>
                        {feedback}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FillInBlankQuiz;