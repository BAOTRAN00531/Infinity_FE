// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

const TrialComponent = ({ children }) => {
  return (
    <div className="w-full h-screen py-[250px] px-[150px] flex justify-center items-center relative overflow-x-hidden">
      <div className="absolute top-[110px] left-[170px] cursor-pointer">
        <Link to="/hoc">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path
              d="M27 9L9 27M9 9L27 27"
              stroke="#CBD5E1"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default TrialComponent;
