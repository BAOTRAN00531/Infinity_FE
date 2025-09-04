// @ts-nocheck
import React from "react";
import { useQuizz } from "../../../../contexts/QuizzContext";
import Footer from "../../../layouts/lesson/Footer";
import Notification from "../../../reuseables/Notification";
import { cn } from "../../../../lib/utils";

function FillInTheBlank() {
  const {
    state: {
      useVocab,
      selectedWords,
      questions,
      currentQuestionIndex,
      textAnswer,
      hasChecked,
      isCorrect,
    },
    setUseVocab,
    setAnswered,
    setTextAnswer,
    setChecked,
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];

  const [answers, setAnswers] = React.useState([]);

  const handleAnswerChange = (lineIndex, blankIndex, value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[lineIndex] = newAnswers[lineIndex] || {};
      newAnswers[lineIndex][blankIndex] = value;
      return newAnswers;
    });
  };

  const onCheckAnswer = () => {
    const blanks = currentQuestion.correctAnswer?.blanks || [];
    const userAnswers = answers.map((line) => Object.values(line).join(" "));
    // console.log("expected result => blanks:", blanks);
    // console.log("userAnswers:", userAnswers);
    const isCorrect = blanks.every((blank, index) =>
      userAnswers[index]?.toLowerCase().includes(blank.toLowerCase())
    );
    // console.log(isCorrect ? "Correct!" : "Incorrect!");

    setChecked(isCorrect);
  };

  React.useEffect(() => {
    if (answers.length === 2) {
      setAnswered(true);
    }
  }, [answers]);

  return (
    <div className="question mt-24 mx-24 space-y-24">
      <h1 className="text-xl font-bold">{currentQuestion.title}</h1>
      <div className="flex flex-col w-full gap-5">
        {currentQuestion.conversation.lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            <div
              className={`max-w-[70%] p-2.5 rounded-2xl border-2 border-slate-300 ${
                line.speaker == "left" ? "self-start" : "self-end"
              }`}
            >
              {line.content.split("___").map((part, partIndex, parts) => (
                <React.Fragment key={partIndex}>
                  {part}
                  {partIndex < parts.length - 1 && (
                    <input
                      type="text"
                      className={cn([
                        "border-b-2 border-dashed mb-2 text-center outline-none",
                        "focus:border-slate-600",
                      ])}
                      style={{
                        width: `${
                          (currentQuestion.correctAnswer?.blanks[lineIndex]
                            .length || 1) * 20
                        }px`,
                      }}
                      data-line={lineIndex}
                      data-blank={line.blankPositions[partIndex]?.blankIndex}
                      onChange={(e) =>
                        handleAnswerChange(
                          lineIndex,
                          line.blankPositions[partIndex]?.blankIndex,
                          e.target.value
                        )
                      }
                      value={
                        answers[lineIndex]?.[
                          line.blankPositions[partIndex]?.blankIndex
                        ] || ""
                      }
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      {hasChecked ? (
        <Notification type={isCorrect ? "correct" : "incorrect"} />
      ) : (
        <Footer
          showVocab={false}
          showToggleVocab={false}
          onCheckAnswer={onCheckAnswer}
        />
      )}
    </div>
  );
}

export default FillInTheBlank;
