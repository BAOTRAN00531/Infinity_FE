// @ts-nocheck
import React from "react";
import { useQuizz } from "../../../../contexts/QuizzContext";
import Footer from "../../../layouts/lesson/Footer";
import Notification from "../../../reuseables/Notification";

function Rearrange() {
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
  } = useQuizz();
  const currentQuestion = questions[currentQuestionIndex];

  // Update answered state when selectedWords changes
  React.useEffect(() => {
    setAnswered(selectedWords.length > 0 || textAnswer.trim() !== "");
  }, [selectedWords, textAnswer]);

  React.useEffect(() => {
    setUseVocab(true);
  }, []);

  return (
    <div className="question mt-24 mx-24 space-y-24">
      <h1 className="text-xl font-bold">Gõ lại những gì bạn đã nghe thấy</h1>
      <div className="flex gap-16 justify-between">
        <div className="flex w-3xs relative -translate-y-5">
          <img src="/images/characters/wondering-boy.png" alt="Wondering boy" />
          <span className=" absolute left-[60%] -top-8 text-sm text-slate-500 p-2.5 rounded-2xl border-2 border-slate-300 w-full">
            What are you doing?
          </span>
        </div>

        <div className="flex flex-col w-full gap-16">
          {/* Display selected words */}
          <div className="flex flex-col w-full gap-2 min-h-20 p-3">
            {selectedWords.length > 0 ? (
              // Group words into rows
              (() => {
                const rows = [];
                let currentRow = [];
                let currentRowWidth = 0;
                const maxWidth = 600; // Adjust based on your container width

                selectedWords.forEach((word, index) => {
                  // Estimate word width (adjust multiplier based on your font size)
                  const wordWidth = word.text.length * 10 + 24; // px-3 (12px) + padding

                  if (
                    currentRowWidth + wordWidth > maxWidth &&
                    currentRow.length > 0
                  ) {
                    rows.push(currentRow);
                    currentRow = [word];
                    currentRowWidth = wordWidth;
                  } else {
                    currentRow.push(word);
                    currentRowWidth += wordWidth + 8; // + gap
                  }

                  // Push the last row
                  if (index === selectedWords.length - 1) {
                    rows.push(currentRow);
                  }
                });

                return rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex flex-wrap items-center gap-2 pb-2 border-b-2 border-slate-300"
                  >
                    {row.map((word) => (
                      <span
                        key={word.id}
                        className="px-3 py-1 flex-center bg-background rounded-2xl"
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>
                ));
              })()
            ) : (
              <span className="text-slate-300 pb-2 border-b-2 border-slate-300">
                Chọn từ vựng từ danh sách bên dưới
              </span>
            )}
          </div>
        </div>
      </div>
      {hasChecked ? (
        <Notification type={isCorrect ? "correct" : "incorrect"} />
      ) : (
        <Footer showVocab={true} showToggleVocab={false} />
      )}
    </div>
  );
}

export default Rearrange;
