// @ts-nocheck
import { useQuizz } from "../../../contexts/QuizzContext";

function ProgressBar() {
  const { state: progress } = useQuizz();

  return (
    <div
      className="grow h-2 rounded-full bg-slate-300 shrink-0"
      aria-label="progress-bar"
    >
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
export default ProgressBar;
