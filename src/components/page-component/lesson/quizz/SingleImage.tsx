// @ts-nocheck
import { useQuizz } from "../../../../contexts/QuizzContext";
import { cn } from "../../../../lib/utils";
import Footer from "../../../layouts/lesson/Footer";
import Notification from "../../../reuseables/Notification";

function SingleImage() {
  const {
    state: { questions, currentQuestionIndex, hasChecked, isCorrect },
    setAnswered,
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="question mt-24 mx-24 space-y-24">
      <h1 className="text-xl font-bold">{currentQuestion.title}</h1>
      <div className="flex gap-8 justify-between">
        {currentQuestion.options.map((option) => (
          <label
            key={option.id}
            className={cn([
              "rounded-2xl border-2 border-slate-300 text-slate-600 flex-center flex-col gap-4 p-3",
              "has-checked:border-primary has-checked:text-primary",
            ])}
          >
            <input
              type="radio"
              hidden
              name="answer"
              value={option.id}
              onChange={() => {
                setAnswered(option.id);
              }}
            />
            <img src={option.image} alt={option.text} />
            <span className="text-center text-base be-vietnam-pro-bold">
              {option.text}
            </span>
          </label>
        ))}
      </div>
      {hasChecked ? (
        <Notification type={isCorrect ? "correct" : "incorrect"} />
      ) : (
        <Footer showVocab={false} showToggleVocab={false} />
      )}
    </div>
  );
}

export default SingleImage;
