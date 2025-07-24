import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FillInBlankQuiz from "@/components/FillInBlankQuiz";

const FillInBlank = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-quiz-choice/20 p-5">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">
                        Infinity Language Learning
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Chọn loại bài học bạn muốn thực hành
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button asChild variant="outline" className="px-8 py-3 text-base">
                            <Link to="/">Multiple Choice Quiz</Link>
                        </Button>
                        <Button asChild variant="outline" className="px-8 py-3 text-base">
                            <Link to="/translation">Translation Exercise</Link>
                        </Button>
                        <Button asChild variant="outline" className="px-8 py-3 text-base">
                            <Link to="/pairmatching">Pairmatching Quiz</Link>
                        </Button>
                        <Button asChild className="px-8 py-3 text-base">
                            <Link to="/fillinblank">Pairmatching Quiz</Link>
                        </Button>
                    </div>
                </div>

                <FillInBlankQuiz />
            </div>
        </div>
    );
};

export default FillInBlank;