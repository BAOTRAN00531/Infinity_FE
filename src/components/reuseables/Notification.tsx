// @ts-nocheck
import { CheckCircleIcon, CircleDashedIcon, CircleXIcon } from "lucide-react";
import Button from "./Button";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { useQuizz } from "../../contexts/QuizzContext";

function Notification({ type }) {
  const { nextQuestion } = useQuizz();

  const renderIcon = () => {
    switch (type) {
      case "correct":
        return (
          <div className="p-2.5 rounded-full bg-primary/10">
            <CheckCircleIcon
              strokeWidth={2}
              className="text-primary"
              size={48}
            />
          </div>
        );

      case "incorrect":
        return (
          <div className="p-2.5 rounded-full bg-red-100">
            <CircleXIcon strokeWidth={2} className="text-red-500" size={48} />
          </div>
        );

      case "skip":
        return (
          <div className="p-2.5 rounded-full bg-accent/10">
            <CircleDashedIcon
              strokeWidth={2}
              className="text-accent"
              size={48}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const styles = {
    correct: "bg-[#e1e9f2] border-primary",
    incorrect: "bg-red-50 border-red-500",
    skip: "bg-accent/10 border-accent",
  };

  return (
    <motion.div
      initial={{ y: "100px" }}
      animate={{ y: 0 }}
      className={cn([
        "notification absolute bottom-0 left-0 right-0 min-h-fit py-24 border-t-2 ",
        styles[type],
      ])}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {renderIcon()}
            <span className="font-bold">
              {type === "correct" && "Bạn đã làm rất tốt"}
              {type === "incorrect" && "Oops! Bạn đùa thôi đúng không?"}
              {type === "skip" && "Bạn đã bỏ qua câu hỏi này."}
            </span>
          </div>
          <Button
            onclick={nextQuestion}
            className={cn([
              type === "correct" && "bg-primary shadow-primary",
              type === "incorrect" && "bg-red-500 shadow-red-500",
              type === "skip" && "bg-accent shadow-accent",
            ])}
          >
            <span className="font-bold">Tiếp tục</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default Notification;
