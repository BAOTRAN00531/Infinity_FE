// @ts-nocheck
import React from "react";
import Button from "../../reuseables/Button";
import { Link } from "react-router-dom";

const renders = {
  success: {
    backgroundColor: "#58A6FF1A",
    border: "#58A6FF",
    color: "#58A6FF",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="47"
        height="46"
        viewBox="0 0 47 46"
        fill="none"
      >
        <path
          d="M43.0973 19.0068C44.0107 23.4894 43.3598 28.1497 41.253 32.2104C39.1463 36.2711 35.7111 39.4869 31.5203 41.3214C27.3296 43.156 22.6366 43.4984 18.2239 42.2916C13.8113 41.0847 9.9457 38.4016 7.27187 34.6897C4.59804 30.9777 3.27756 26.4613 3.53064 21.8936C3.78373 17.3259 5.59507 12.983 8.66262 9.58916C11.7302 6.19532 15.8685 3.95568 20.3874 3.24372C24.9064 2.53177 29.5329 3.39054 33.4953 5.67681M17.4953 21.0068L23.4953 27.0068L43.4953 7.00681"
          stroke="#58A6FF"
          strokeWidth="6" // Changed to camelCase
          strokeLinecap="round" // Changed to camelCase
          strokeLinejoin="round" // Changed to camelCase
        />
      </svg>
    ),
    typeButton: "",
  },
  fail: {
    backgroundColor: "#EF44441A",
    border: "#EF4444",
    color: "#EF4444",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
      >
        <path
          d="M27.3333 16.5003L16.3333 27.5003M16.3333 16.5003L27.3333 27.5003M40.1667 22.0003C40.1667 32.1255 31.9586 40.3337 21.8333 40.3337C11.7081 40.3337 3.5 32.1255 3.5 22.0003C3.5 11.8751 11.7081 3.66699 21.8333 3.66699C31.9586 3.66699 40.1667 11.8751 40.1667 22.0003Z"
          stroke="#EF4444"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    typeButton: "danger",
  },
};

const ToastAuthComponent = ({
  message,
  content,
  contentDetail,
  link,
  nameButton,
}) => {
  const render = renders[message];

  return (
    <div
      className={`w-full flex items-center justify-between absolute py-[76px] px-[275px] left-0 bottom-0 border-t-2 transition delay-150 duration-300 ease-in-out`}
      style={{
        backgroundColor: render?.backgroundColor,
        borderColor: render?.border,
      }}
    >
      <div className="flex items-center gap-10">
        {render?.icon}
        {contentDetail ? (
          <div className={"flex flex-col gap-3 justify-center"}>
            <span
              className={`uppercase font-bold m-auto`}
              style={{
                color: render?.color,
              }}
            >
              {content}
            </span>
            <span
              className={`text-[14px] font-[400]]`}
              style={{ color: render?.color }}
            >
              {contentDetail}
            </span>
          </div>
        ) : (
          <span
            className={`uppercase font-bold m-auto`}
            style={{
              color: render?.color,
            }}
          >
            {content}
          </span>
        )}
      </div>

      <Button type={render?.typeButton}>
        <Link to={link}>{nameButton ? nameButton : "Tiếp tục"}</Link>
      </Button>
    </div>
  );
};

export default ToastAuthComponent;
