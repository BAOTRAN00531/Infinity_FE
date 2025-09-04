// @ts-nocheck
import { NavLink } from "react-router-dom";
import { useQuizz } from "../../../../contexts/QuizzContext";
import { cn } from "../../../../lib/utils";
import Button from "../../../reuseables/Button";

function QuizzResult() {
  // const {
  //   state: { result },
  // } = useQuizz();
  const result = 33;

  return (
    <div className="flex flex-col h-screen w-full be-vietnam-pro-regular">
      <div className="max-w-sm grow flex-center flex-col mt-10 mx-auto gap-8 *:text-center *:text-slate-600 ">
        <div
          className={cn([
            "flex-center p-2.5 rounded-full border-4 w-fit aspect-square",
            result > 90
              ? "border-primary"
              : result > 80
              ? "border-green-400"
              : result > 60
              ? "border-accent"
              : "border-red-400",
          ])}
        >
          <h1
            className={cn([
              "text-5xl font-black",
              result > 90
                ? "text-primary"
                : result > 80
                ? "text-green-400"
                : result > 60
                ? "text-accent"
                : "text-red-400",
            ])}
          >
            {result}
          </h1>
        </div>
        <img
          src={
            result > 90
              ? "/images/quizz-result/exellent.png"
              : result > 80
              ? "/images/quizz-result/good.png"
              : result > 60
              ? "/images/quizz-result/average.png"
              : "/images/quizz-result/orange-meo-meo.png"
          }
          alt="Exellent grades"
        />
        <h2 className="text-xl font-bold ">
          {result > 90
            ? "Tuyệt vời! Bạn đã học được thêm 10 từ vựng mới trong hôm nay!"
            : result > 80
            ? "Rất tốt! Bạn đã đạt điểm cao hơn 70% người học trong lần đầu tiên"
            : result > 60
            ? "Rất cố gắng! Hãy ôn tập để cải thiện điểm vào lần sau nhé!"
            : "Oops! Không ổn rồi. Ôn tập ngay thôi!"}
        </h2>
        <p className="text-xl">
          {result > 90
            ? "Cố gắng giữ lửa nhé 🔥"
            : result > 80
            ? "Tiếp tục phát huy nhé 💪"
            : result > 60
            ? "Ôn tập thêm để cải thiện nhé 📚"
            : "Đừng nản lòng, cố gắng hơn nữa nhé! 🌟"}
        </p>
      </div>
      <div
        className={cn([
          "w-full flex-center border-t-2 self-end",
          result > 90
            ? "border-primary"
            : result > 80
            ? "border-green-400"
            : result > 60
            ? "border-accent"
            : "border-red-500",
        ])}
      >
        <div className="mx-auto w-4xl px-4 py-16 text-slate-600 flex justify-between items-center">
          <h2
            className={cn([
              "text-xl font-bold uppercase",
              result > 90
                ? "text-primary"
                : result > 80
                ? "text-green-400"
                : result > 60
                ? "text-accent"
                : "text-red-400",
            ])}
          >
            {result > 90
              ? "Rất xuất sắc"
              : result > 80
              ? "Rất tốt"
              : result > 60
              ? "Cần cải thiện"
              : "Cần cố gắng hơn"}
          </h2>
          <NavLink to={"/hoc"}>
            <Button
              className={cn([
                "w-fit px-6 py-3",
                result > 90
                  ? "bg-primary text-white"
                  : result > 80
                  ? "bg-green-400 text-white shadow-green-800"
                  : result > 60
                  ? "bg-accent text-white shadow-accent"
                  : "bg-red-400 text-white shadow-red-800",
              ])}
            >
              <span className="text-lg">Tiếp tục</span>
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default QuizzResult;
