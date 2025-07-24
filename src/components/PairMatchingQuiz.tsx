import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface WordPair {
    id: string;
    left: string;
    right: string;
}

interface Match {
    leftId: string;
    rightId: string;
    isCorrect: boolean;
    isCompleted: boolean;
}

const PairMatchingQuiz = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [allCompleted, setAllCompleted] = useState(false);

    const pairs: WordPair[] = [
        { id: "1", left: "Milk", right: "Sữa" },
        { id: "2", left: "Sugar", right: "Đường" },
        { id: "3", left: "Tea", right: "Trà" }
    ];

    // Cố định vị trí từ để tránh re-shuffle
    const [rightWords] = useState(() => {
        return pairs.map(pair => ({ id: pair.id, text: pair.right })).sort(() => Math.random() - 0.5);
    });

    const leftWords = pairs.map(pair => ({ id: pair.id, text: pair.left }));

    // Kiểm tra khi nào tất cả cặp đều đúng
    useEffect(() => {
        if (matches.length === pairs.length) {
            const allCorrect = matches.every(match => match.isCorrect && match.isCompleted);
            setAllCompleted(allCorrect);
        }
    }, [matches, pairs.length]);

    const createMatch = (leftId: string, rightId: string) => {
        const isCorrect = leftId === rightId;
        const newMatch: Match = {
            leftId,
            rightId,
            isCorrect,
            isCompleted: isCorrect
        };

        setMatches([...matches, newMatch]);
        setSelectedLeft(null);
        setSelectedRight(null);
    };

    const handleLeftClick = (id: string) => {
        // Nếu từ này đã được ghép và đúng thì không cho click
        const existingMatch = matches.find(match => match.leftId === id);
        if (existingMatch && existingMatch.isCompleted) return;

        if (selectedLeft === id) {
            setSelectedLeft(null);
            return;
        }

        setSelectedLeft(id);

        if (selectedRight) {
            createMatch(id, selectedRight);
        }
    };

    const handleRightClick = (id: string) => {
        // Nếu từ này đã được ghép và đúng thì không cho click
        const existingMatch = matches.find(match => match.rightId === id);
        if (existingMatch && existingMatch.isCompleted) return;

        if (selectedRight === id) {
            setSelectedRight(null);
            return;
        }

        setSelectedRight(id);

        if (selectedLeft) {
            createMatch(selectedLeft, id);
        }
    };

    const handleRemoveMatch = (leftId: string, rightId: string) => {
        setMatches(matches.filter(match => !(match.leftId === leftId && match.rightId === rightId)));
    };

    const isMatched = (id: string, side: 'left' | 'right') => {
        return matches.some(match =>
            side === 'left' ? match.leftId === id : match.rightId === id
        );
    };

    const getMatchedPair = (id: string, side: 'left' | 'right') => {
        return matches.find(match =>
            side === 'left' ? match.leftId === id : match.rightId === id
        );
    };

    const handleReset = () => {
        setMatches([]);
        setSelectedLeft(null);
        setSelectedRight(null);
        setAllCompleted(false);
    };

    const getWordStyles = (id: string, side: 'left' | 'right', isSelected: boolean) => {
        const baseStyles = "w-full h-14 py-3 px-6 rounded-xl font-mono text-base transition-all duration-150 ease-in-out flex items-center justify-center";


        const matchedPair = getMatchedPair(id, side);

        if (matchedPair) {
            if (matchedPair.isCompleted) {
                // Đúng và hoàn thành
                return cn(
                    baseStyles,
                    "bg-quiz-correct shadow-[0_4px_0_hsl(var(--quiz-correct-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-correct-shadow))] cursor-not-allowed opacity-90"
                );
            } else {
                // Sai và vẫn có thể chỉnh sửa
                return cn(
                    baseStyles,
                    "bg-quiz-wrong shadow-[0_4px_0_hsl(var(--quiz-wrong-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-wrong-shadow))]"
                );
            }
        }

        if (isSelected) {
            return cn(
                baseStyles,
                "bg-quiz-selected border-2 border-foreground shadow-[0_4px_0_hsl(var(--quiz-choice-shadow))] active:shadow-[0_2px_0_hsl(var(--quiz-choice-shadow))]"
            );
        }

        const sideColor = side === 'left' ? 'quiz-pair-left' : 'quiz-pair-right';
        const sideShadow = side === 'left' ? 'quiz-pair-left-shadow' : 'quiz-pair-right-shadow';

        return cn(
            baseStyles,
            `bg-${sideColor} shadow-[0_4px_0_hsl(var(--${sideShadow}))] active:shadow-[0_2px_0_hsl(var(--${sideShadow}))]`
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-quiz-choice/20 p-5">
            <div className="max-w-4xl mx-auto">
                {/* Header with close button */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center text-foreground">
                        Chọn các cặp từ
                    </h1>
                </div>

                {/* Instruction */}
                <p className="text-center text-muted-foreground mb-8 text-lg">
                    Chạm vào các từ để ghép thành cặp
                </p>

                {/* Two columns layout */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Left column */}
                    <div className="space-y-4">
                        {leftWords.map((word) => {
                            const matched = isMatched(word.id, 'left');
                            const matchedPair = getMatchedPair(word.id, 'left');

                            return (
                                <div key={word.id} className="relative">
                                    <button
                                        onClick={() => handleLeftClick(word.id)}
                                        className={getWordStyles(word.id, 'left', selectedLeft === word.id)}
                                        disabled={matchedPair?.isCompleted}
                                    >
                                        {word.text}
                                    </button>
                                    {matched && !matchedPair?.isCompleted && matchedPair && (
                                        <button
                                            onClick={() => handleRemoveMatch(word.id, matchedPair.rightId)}
                                            className="absolute -top-2 -right-2 bg-background border-2 border-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-muted"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        {rightWords.map((word) => {
                            const matched = isMatched(word.id, 'right');
                            const matchedPair = getMatchedPair(word.id, 'right');

                            return (
                                <div key={word.id} className="relative">
                                    <button
                                        onClick={() => handleRightClick(word.id)}
                                        className={getWordStyles(word.id, 'right', selectedRight === word.id)}
                                        disabled={matchedPair?.isCompleted}
                                    >
                                        {word.text}
                                    </button>
                                    {matched && !matchedPair?.isCompleted && matchedPair && (
                                        <button
                                            onClick={() => handleRemoveMatch(matchedPair.leftId, word.id)}
                                            className="absolute -top-2 -right-2 bg-background border-2 border-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-muted"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="px-8 py-3 text-base font-mono"
                    >
                        Làm lại
                    </Button>
                </div>

                {/* Success message */}
                {allCompleted && (
                    <div className="text-center text-xl font-bold text-quiz-correct animate-in fade-in-50 duration-300">
                        ✔️ Giỏi quá! Tất cả đều đúng!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PairMatchingQuiz;