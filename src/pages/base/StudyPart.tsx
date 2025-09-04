// @ts-nocheck
import { CheckIcon, CircleDashedIcon, LoaderIcon } from "lucide-react";
import NextLessonBox from "../../components/page-component/base/NextLessonBox";
import TrialBox from "../../components/page-component/base/TrialBox";
import Button from "../../components/reuseables/Button";
import { cn } from "../../lib/utils";
import { NavLink } from "react-router-dom";

const studyParts = [
  {
    title: "Thì hiện tại đơn",
    styles: "bg-red-400",
    status: "done",
  },
  {
    title: "Thì hiện tại tiếp diễn",
    styles: "bg-green-400",
    status: "in-progress",
  },
  {
    title: "Thì hiện tại hoàn thành",
    styles: "bg-blue-400",
    status: "not-started",
  },
  {
    title: "Thì hiện tại hoàn thành tiếp diễn",
    styles: "bg-blue-400",
    status: "not-started",
  },
  {
    title: "Thì quá khứ đơn",
    styles: "bg-yellow-400",
    status: "not-started",
  },
  {
    title: "Thì quá khứ tiếp diễn",
    styles: "bg-yellow-400",
    status: "not-started",
  },
  {
    title: "Thì quá khứ hoàn thành",
    styles: "bg-yellow-400",
    status: "not-started",
  },
  {
    title: "Thì quá khứ hoàn thành tiếp diễn",
    styles: "bg-yellow-400",
    status: "not-started",
  },
];

function StudyPart() {
  return (
    <div className="flex gap-8">
      <div className="grow">
        <div className="max-w-sm mx-auto flex flex-col gap-5">
          {studyParts.map((part) => (
            <NavLink
              to={"#"}
              className={cn([
                "flex items-center justify-between rounded-2xl p-3 gap-8",
                part.styles,
                part.status === "not-started" && "opacity-50",
              ])}
            >
              <h2 className="be-vietnam-pro-black text-base leading-6 uppercase text-white">
                {`Phần ${studyParts.indexOf(part) + 1}: ${part.title}`}
              </h2>
              <div className="flex-center p-2.5 rounded-2xl bg-white/10">
                {part.status === "done" && (
                  <CheckIcon size={36} strokeWidth={4} className="text-white" />
                )}
                {part.status === "in-progress" && (
                  <LoaderIcon
                    size={36}
                    strokeWidth={4}
                    className="text-white"
                  />
                )}
                {part.status === "not-started" && (
                  <CircleDashedIcon
                    size={36}
                    strokeWidth={4}
                    className="text-white"
                  />
                )}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <aside className="max-w-[360px] h-full flex flex-col gap-8">
        <div
          role="course"
          className="bg-accent flex items-start justify-between gap-4 rounded-2xl p-3"
        >
          <h2 className="be-vietnam-pro-black text-white text-base leading-5 max-w-[200px]">
            PHẦN 2: THÌ HIỆN TẠI HOÀN THÀNH
          </h2>
          <Button type="muted" className="p-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.6665 22.75V5.25C4.6665 4.47645 4.97379 3.73459 5.52078 3.18761C6.06776 2.64062 6.80962 2.33333 7.58317 2.33333H22.1665C22.4759 2.33333 22.7727 2.45625 22.9915 2.67504C23.2103 2.89384 23.3332 3.19058 23.3332 3.5V24.5C23.3332 24.8094 23.2103 25.1062 22.9915 25.325C22.7727 25.5438 22.4759 25.6667 22.1665 25.6667H7.58317C6.80962 25.6667 6.06776 25.3594 5.52078 24.8124C4.97379 24.2654 4.6665 23.5235 4.6665 22.75ZM4.6665 22.75C4.6665 21.9765 4.97379 21.2346 5.52078 20.6876C6.06776 20.1406 6.80962 19.8333 7.58317 19.8333H23.3332M10.4998 11.0833L12.8332 13.4167L17.4998 8.75"
                stroke="#475569"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </div>
        {/* Next lesson box */}
        <NextLessonBox />
        <TrialBox />
      </aside>
    </div>
  );
}

export default StudyPart;
