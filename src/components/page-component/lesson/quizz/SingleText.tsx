// @ts-nocheck
import { useQuizz } from "../../../../contexts/QuizzContext";
import { cn } from "../../../../lib/utils";
import Footer from "../../../layouts/lesson/Footer";
import Notification from "../../../reuseables/Notification";

function SingleText() {
  const {
    state: { questions, currentQuestionIndex, hasChecked, isCorrect },
    setAnswered,
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="question mt-24 mx-24 space-y-24">
      <h1 className="text-xl font-bold">{currentQuestion.title}</h1>
      <div className="flex gap-16 justify-between">
        <div className="flex w-3xs relative -translate-y-5 -translate-x-10 shrink-0">
          <img src="/images/characters/wondering-boy.png" alt="Wondering boy" />
          <span className=" absolute left-[60%] -top-8 text-sm text-slate-500 p-2.5 rounded-2xl border-2 border-slate-300 w-max">
            What are you doing?
          </span>
        </div>

        <div className="flex flex-col w-fit gap-4">
          {/* Display options */}
          {currentQuestion.options.map((option) => (
            <label
              key={option.id}
              className={cn([
                "w-full min-w-[300px] bg-background text-slate-600 font-bold py-2.5 px-4 rounded-2xl shadow-secondary transition text-center",
                "has-checked:bg-primary has-checked:text-white has-checked:shadow-primary",
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
              <span className="text-base be-vietnam-pro-bold">
                {option.text}
              </span>
            </label>
          ))}
        </div>
      </div>
      {hasChecked ? (
        <Notification type={isCorrect ? "correct" : "incorrect"} />
      ) : (
        <Footer showVocab={false} showToggleVocab={false} />
      )}
    </div>
  );
}

export default SingleText;
