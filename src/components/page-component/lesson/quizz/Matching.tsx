// @ts-nocheck
import React from "react";
import { useQuizz } from "../../../../contexts/QuizzContext";
import Footer from "../../../layouts/lesson/Footer";
import Notification from "../../../reuseables/Notification";
import Button from "../../../reuseables/Button";
import { redirect } from "react-router-dom";

function Matching() {
  const {
    state: { lesson, questions, currentQuestionIndex, hasChecked, isCorrect },
    setAnswered,
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedLeft, setSelectedLeft] = React.useState(null);
  const [selectedRight, setSelectedRight] = React.useState(null);
  const [destroyedPairs, setDestroyedPairs] = React.useState([]);
  const [shuffledRight, setShuffledRight] = React.useState([]);
  const [wrongPair, setWrongPair] = React.useState(false);

  // Shuffle right column
  React.useEffect(() => {
    setShuffledRight(
      [...currentQuestion.rightColumn].sort(() => Math.random() - 0.5)
    );
  }, [currentQuestion]);

  const handleLeftClick = (leftItem) => {
    if (destroyedPairs.includes(leftItem.id)) return;
    setSelectedLeft(leftItem);
    setSelectedRight(null);
    setWrongPair(false);
  };

  const handleRightClick = (rightItem) => {
    if (destroyedPairs.includes(rightItem.id)) return;

    setSelectedRight(rightItem);

    if (selectedLeft) {
      const isMatch =
        currentQuestion.correctPairs[selectedLeft.id] === rightItem.id;

      if (isMatch) {
        setDestroyedPairs([...destroyedPairs, selectedLeft.id, rightItem.id]);
      } else {
        setWrongPair(true);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(false);
        }, 1000); // Keep red for 1 second
      }
    }
  };

  const isCompleted = destroyedPairs.length === 8;

  return (
    <div className="question mt-24 mx-24 space-y-24">
      <h1 className="text-xl font-bold">{currentQuestion.title}</h1>
      <div className="flex gap-16 justify-between">
        {/* Left Column (English) */}
        <div className="w-full grow space-y-4 ">
          {currentQuestion.leftColumn.map((item) => (
            <Button
              key={item.id}
              onclick={() => handleLeftClick(item)}
              className={`normal-case max-w-none w-full
                ${
                  selectedLeft?.id === item.id
                    ? "bg-primary text-white shadow-primary"
                    : ""
                }
                ${
                  destroyedPairs.includes(item.id)
                    ? "bg-slate-100 text-slate-300 shadow-none"
                    : ""
                }
                ${
                  wrongPair &&
                  (selectedLeft?.id === item.id ||
                    selectedRight?.id === item.id)
                    ? "bg-red-400 *:text-white shadow-red-500 animate-shake"
                    : ""
                }
                `}
              type="secondary"
            >
              {item.text}
            </Button>
          ))}
        </div>

        {/* Right Column (Mother Tongue) */}
        <div className="w-full grow space-y-4 ">
          {shuffledRight.map((item) => (
            <Button
              key={item.id}
              onclick={() => handleRightClick(item)}
              className={`normal-case max-w-none w-full
                ${
                  selectedRight?.id === item.id
                    ? "bg-primary text-white shadow-primary"
                    : ""
                }
                ${
                  destroyedPairs.includes(item.id)
                    ? "bg-slate-100 text-slate-300 shadow-none"
                    : ""
                }
                ${
                  wrongPair &&
                  (selectedLeft?.id === item.id ||
                    selectedRight?.id === item.id)
                    ? "bg-red-400 *:text-white shadow-red-500 animate-shake"
                    : ""
                }
                `}
              type="secondary"
            >
              {item.text}
            </Button>
          ))}
        </div>
      </div>
      {isCompleted && (
        <Notification
          type={"success"}
          onclick={() => redirect(`/hoc/bai-hoc/${lesson.slug}/ket-qua`)}
        />
      )}
    </div>
  );
}

export default Matching;
