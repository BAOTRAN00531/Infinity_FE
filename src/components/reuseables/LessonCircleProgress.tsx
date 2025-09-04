// @ts-nocheck
import { Book } from "lucide-react";
import React from "react";
import ArcProgress from "react-arc-progress";
import { cn } from "../../lib/utils";
import Button from "../reuseables/Button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { NavLink } from "react-router-dom";

export default function MyArcProgress({ ...props }) {
  const thickness = 4;
  const arcStart = 110; // Start angle in degrees
  const arcEnd = 70;
  const arcSize = props.size || 112;
  const arcProgress = Number((props.progress / 100).toFixed(3));

  const renderBackgroundCircular = React.useCallback(() => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="113"
        height="110"
        viewBox="0 0 113 110"
        fill="none"
      >
        <path
          d="M39.7432 107.668C39.461 108.532 38.5307 109.006 37.6754 108.698C25.6543 104.377 15.4541 96.0678 8.79212 85.1298C1.84442 73.7226 -0.797354 60.2078 1.3435 47.024C3.48436 33.8402 10.2669 21.8557 20.4671 13.2331C30.6674 4.61044 43.6137 -0.0824927 56.9699 0.00108557C70.3261 0.0846618 83.2126 4.93925 93.3042 13.6889C103.396 22.4385 110.028 34.5069 112.003 47.7164C113.979 60.926 111.168 74.4067 104.078 85.7261C97.2802 96.5799 86.9767 104.761 74.9025 108.931C74.0434 109.228 73.1191 108.743 72.8478 107.875C72.5764 107.008 73.0609 106.087 73.9194 105.789C85.2446 101.854 94.9076 94.1675 101.289 83.979C107.962 73.3249 110.608 60.6365 108.748 48.2033C106.889 35.7701 100.647 24.411 91.1481 16.1756C81.6497 7.94022 69.5205 3.37095 56.9493 3.29228C44.378 3.21362 32.1927 7.63074 22.5919 15.7466C12.9911 23.8625 6.60725 35.1426 4.59221 47.5515C2.57718 59.9605 5.06369 72.681 11.6031 83.4178C17.8566 93.6853 27.4227 101.492 38.6978 105.568C39.5525 105.877 40.0254 106.804 39.7432 107.668Z"
          fill="#D9D9D9"
        />
      </svg>
    );
  }, []);

  return (
    <div
      className={cn([
        "flex-center flex-col w-fit h-fit gap-4 text-center",
        props.className,
      ])}
    >
      <div className="relative flex-center flex-col w-fit h-fit">
        {props.progress === 0 ? (
          renderBackgroundCircular()
        ) : (
          <ArcProgress
            size={arcSize}
            arcStart={arcStart}
            arcEnd={360 + arcEnd}
            thickness={thickness}
            fillColor={"#E79A1D"}
            progress={arcProgress}
          />
        )}

        <div className="flex-col flex-center abs-center gap-2 top-[62%]">
          <Popover>
            <PopoverTrigger>
              <Button
                asChild
                className={cn([
                  "rounded-full p-4 !min-w-20 h-20 aspect-square -translate-y-0.5 group",
                  "relative",
                ])}
                type={props?.isUnlocked ? "primary" : "secondary"}
                disabled={!props?.isUnlocked}
                aria-label="Go to lesson"
                title="Go to lesson"
                onClick={props?.onClick}
              >
                {props?.lesson?.icon || <Book strokeWidth={4} size={48} />}
                {props?.lesson?.status === "up-comming" && (
                  <div className="absolute group-active:invisible group-active:opacity-0">
                    <ChatBox>BẮT ĐẦU</ChatBox>
                  </div>
                )}
              </Button>
              <span className="be-vietnam-pro-bold text-slate-300 -translate-y-2.5 text-center">
                {props?.lessonNumber}
              </span>
            </PopoverTrigger>
            <PopoverContent
              className={
                "bg-primary text-white be-vietnam-pro-regular flex flex-col gap-5 p-4 rounded-2xl"
              }
            >
              <h2 className="font-black uppercase">
                {props?.lesson?.title || "Lesson Title"}
              </h2>
              <p>
                {props.lesson.progress > 0
                  ? `Đã hoàn thành với ${props.lesson.progress}% độ chính xác!`
                  : props?.lesson?.description}
              </p>
              <NavLink
                to={`/hoc/bai-hoc/${props?.lesson?.slug}`}
                className={"block"}
              >
                <Button type="secondary" className="max-w-full w-full">
                  {props.lesson.progress > 0 ? "Học lại" : "Học ngay"}
                </Button>
              </NavLink>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <h4
        className={cn([
          "be-vietnam-pro-bold text-base",
          props?.isUnlocked ? "text-slate-600" : "text-slate-300",
        ])}
      >
        {props?.lesson?.title || "Lesson Title"}
      </h4>
    </div>
  );
}

const ChatBox = ({ children }) => {
  return (
    <div className="relative animate-bounce -translate-y-10">
      {/* Main chat box */}
      <div className="min-w-28 h-10 bg-gray-100 rounded-lg border border-slate-300 relative">
        {/* Ribbon triangle */}
        <div
          className="absolute -bottom-2 left-[calc(50%-10px)] w-0 h-0
          border-l-[10px] border-l-transparent
          border-t-[10px] border-t-gray-100
          border-r-[10px] border-r-transparent
          border-b-0"
        ></div>
      </div>

      {/* Optional: Add text inside the chat box */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-700">
        {children}
      </div>
    </div>
  );
};
