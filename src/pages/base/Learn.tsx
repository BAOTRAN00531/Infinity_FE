// @ts-nocheck
import {
  BookIcon,
  HeadphonesIcon,
  Link2Icon,
  SendIcon,
  TrophyIcon,
} from "lucide-react";
import Button from "../../components/reuseables/Button";
import LessonProgressCircle from "../../components/reuseables/LessonCircleProgress";
import NextLessonBox from "../../components/page-component/base/NextLessonBox";
import TrialBox from "../../components/page-component/base/TrialBox";
import { NavLink } from "react-router-dom";

const lessons = [
  {
    title: "Thì hiện tại hoàn thành",
    slug: "present-perfect",
    description:
      "Thì hiện tại hoàn thành được sử dụng để diễn tả một hành động đã xảy ra trong quá khứ và vẫn còn liên quan đến hiện tại.",
    icon: (
      <BookIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 20,
    isUnlocked: true,
    to: "/lesson/part-1/present-perfect",
    onClick: () => console.log("Navigating to lesson"),
  },
  {
    title: "Thì tương lai đơn",
    slug: "simple-future",
    description:
      "Thì tương lai đơn được sử dụng để diễn tả một hành động sẽ xảy ra trong tương lai.",
    icon: (
      <Link2Icon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 75,
    isUnlocked: true,
    to: "/lesson/part-3/simple-future",
    onClick: () => console.log("Navigating to lesson"),
  },
  {
    title: "Thì quá khứ tiếp diễn",
    slug: "past-continuous",
    description:
      "Thì quá khứ tiếp diễn được sử dụng để diễn tả một hành động đang xảy ra tại một thời điểm trong quá khứ.",
    icon: (
      <SendIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 100,
    isUnlocked: true,
    to: "/lesson/part-4/present-continuous",
    onClick: () => console.log("Navigating to lesson"),
  },
  {
    title: "Thì quá khứ đơn",
    slug: "simple-past",
    description:
      "Thì quá khứ đơn được sử dụng để diễn tả một hành động đã xảy ra và kết thúc trong quá khứ.",
    icon: (
      <BookIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: true,
    status: "up-comming",
    to: "/lesson/part-2/simple-past",
    onClick: () => console.log("Navigating to lesson"),
  },
  {
    title: "Câu bị động",
    slug: "passive-voice",
    description:
      "Câu bị động được sử dụng để nhấn mạnh hành động hơn là người thực hiện hành động.",
    icon: (
      <HeadphonesIcon
        className="font-bold text-white"
        strokeWidth={4}
        size={48}
      />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-4/present-continuous",
    onClick: () => console.log("Navigating to lesson"),
  },
  {
    title: "Thử thách cuối cùng",
    slug: "final-challenge",
    description:
      "Thử thách cuối cùng là bài học tổng hợp, giúp bạn ôn tập và áp dụng tất cả kiến thức đã học.",
    icon: (
      <TrophyIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-5/final-challenge",
  },
  {
    title: "Thử thách cuối cùng",
    slug: "final-challenge",
    description:
      "Thử thách cuối cùng là bài học tổng hợp, giúp bạn ôn tập và áp dụng tất cả kiến thức đã học.",
    icon: (
      <TrophyIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-5/final-challenge",
  },
  {
    title: "Thử thách cuối cùng",
    slug: "final-challenge",
    description:
      "Thử thách cuối cùng là bài học tổng hợp, giúp bạn ôn tập và áp dụng tất cả kiến thức đã học.",
    icon: (
      <TrophyIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-5/final-challenge",
  },
  {
    title: "Thử thách cuối cùng",
    slug: "final-challenge",
    description:
      "Thử thách cuối cùng là bài học tổng hợp, giúp bạn ôn tập và áp dụng tất cả kiến thức đã học.",
    icon: (
      <TrophyIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-5/final-challenge",
  },
  {
    title: "Thử thách cuối cùng",
    slug: "final-challenge",
    description:
      "Thử thách cuối cùng là bài học tổng hợp, giúp bạn ôn tập và áp dụng tất cả kiến thức đã học.",
    icon: (
      <TrophyIcon className="font-bold text-white" strokeWidth={4} size={48} />
    ),
    progress: 0,
    isUnlocked: false,
    to: "/lesson/part-5/final-challenge",
  },
];

function Learn() {
  return (
    <div className="flex">
      <LessonGrid lessons={lessons} className="grow" />
      <aside className="max-w-[360px] h-full flex flex-col gap-8">
        <div
          role="course"
          className="bg-accent flex items-start justify-between gap-4 rounded-2xl p-3"
        >
          <h2 className="be-vietnam-pro-black text-white text-base leading-5 max-w-[200px]">
            PHẦN 2: THÌ HIỆN TẠI HOÀN THÀNH
          </h2>
          <NavLink to={"/hoc-phan"}>
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
          </NavLink>
        </div>
        {/* Next lesson box */}
        <NextLessonBox />
        <TrialBox />
      </aside>
    </div>
  );
}

export default Learn;

const LessonGrid = ({ lessons }) => {
  if (!lessons || lessons.length < 4) return null;

  // Calculate how many 3-lesson rows we need
  const extraLessons = lessons.length - 4;
  const threeLessonRows = Math.ceil(extraLessons / 3);

  return (
    <div className="flex-center flex-col gap-4 w-full max-w-3xl mx-auto p-4">
      {/* Fixed Row 1: Single centered lesson */}
      <div className="col-start-3 row-start-1 flex justify-center">
        <LessonProgressCircle
          lesson={lessons[0]}
          lessonNumber={1}
          {...lessons[0]}
        />
      </div>

      {/* Dynamic Middle Rows: 3 lessons per row */}
      {Array.from({ length: threeLessonRows }).map((_, rowIndex) => {
        const startIdx = 1 + rowIndex * 3;
        return (
          <div
            key={`middle-${rowIndex}`}
            className={`flex items-center justify-evenly gap-16`}
          >
            {[0, 2, 4].map((colOffset, idx) => {
              const lessonIdx = startIdx + idx;
              return lessons[lessonIdx] ? (
                <div
                  key={lessonIdx}
                  className={`grow flex justify-evenly min-w-40`}
                >
                  <LessonProgressCircle
                    lesson={lessons[lessonIdx]}
                    lessonNumber={lessonIdx + 1}
                    {...lessons[lessonIdx]}
                  />
                </div>
              ) : null;
            })}
          </div>
        );
      })}

      {/* Fixed Row (second last): 2 centered lessons */}
      <div className={`flex-center gap-16`}>
        {[1, 3].map((colOffset, idx) => {
          const lessonIdx = lessons.length - 3 + idx;
          return lessons[lessonIdx] ? (
            <div
              key={lessonIdx}
              className={`flex-center justify-evenly min-w-40`}
            >
              <LessonProgressCircle
                lesson={lessons[lessonIdx]}
                lessonNumber={lessonIdx + 1}
                {...lessons[lessonIdx]}
              />
            </div>
          ) : null;
        })}
      </div>

      {/* Fixed Last Row: Single centered lesson */}
      <div
        className={`row-start-${
          2 + threeLessonRows + 2
        } col-start-3 flex justify-center`}
      >
        <LessonProgressCircle
          lesson={lessons[lessons.length - 1]}
          lessonNumber={lessons.length}
          {...lessons[lessons.length - 1]}
        />
      </div>
    </div>
  );
};

// Row 1: [empty] [empty] [lesson 1] [empty] [empty]
// Row 2: [lesson 2] [empty] [lesson 3] [empty] [lesson 4]
// Row 3: [lesson 5] [empty] [lesson 6] [empty] [lesson 7]
// Row 4: [empty] [lesson 8] [empty] [lesson 9] [empty]
// Row 5: [empty] [empty] [lesson 10] [empty] [empty]
