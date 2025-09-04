// @ts-nocheck
import React from "react";
import Button from "../../reuseables/Button";
import "./Trial.scss";
import { Link } from "react-router-dom";

const features = [
  { name: "Bài học", free: true, premium: true },
  { name: "Vô hạn lượt học", free: false, premium: true },
  { name: "Tùy chọn nhảy bài", free: false, premium: true },
  { name: "Mở khóa các khóa Pro", free: false, premium: true },
  { name: "Không quảng cáo", free: false, premium: true },
];
const Check = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
  >
    <path
      d="M18 2.7002L7 13.7002L2 8.7002"
      stroke="#94A3B8"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const Minus = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="5"
    viewBox="0 0 18 5"
    fill="none"
  >
    <path
      d="M2 2.60059H16"
      stroke="#94A3B8"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const MainIndexTrialComponent = () => {
  return (
    <div className="w-full h-full flex justify-between items-center gap-[200px]">
      <div className="flex flex-col gap-[38px] flex-1">
        <h1 className="uppercase font-[900] text-4xl text-slate-600">
          trải nghiệm học cực nhanh cùng{" "}
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            infinity pro
          </span>
        </h1>
        <p className="font-normal">
          Dùng thử{" "}
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            Infinity Pro
          </span>{" "}
          trong vòng 14 ngày hoàn toàn miễn phí! Đẩy nhanh quá trình học tập của
          bạn.
        </p>
        <div className="w-full flex justify-between items-center">
          <Button type="ctaPremium">
            <Link to={"/remider"}>Dùng thử ngay</Link>
          </Button>
          <Button type="muted">
            {" "}
            <Link to={"/hoc"}>Không cảm ơn</Link>
          </Button>
        </div>
      </div>
      <div className="flex-2 trial__main__right">
        <div className="trial_table w-full mx-auto rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <table className="w-full p-4">
            <tbody>
              {features.map((feature, idx) => (
                <tr
                  key={idx}
                  className="border-b-4 border-white last:border-none"
                >
                  <td className="py-4 text-slate-700 font-bold">
                    {feature.name}
                  </td>
                  <td className="text-center pr-1.5">
                    {feature.free ? Check : Minus}
                  </td>
                  <td className="text-center pl-1.5">
                    {feature.premium ? Check : Minus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainIndexTrialComponent;
