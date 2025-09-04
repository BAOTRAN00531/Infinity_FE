// @ts-nocheck
import React from "react";
import Button from "../../reuseables/Button";
import "./Trial.scss";
import { Link } from "react-router-dom";

const PlanTrialComponent = () => {
  return (
    <div className="w-full h-full flex justify-between items-center gap-[200px]">
      <div className="flex flex-col gap-[38px] flex-1">
        <h1 className="uppercase font-[900] text-4xl text-slate-600">
          hãy chọn một trong những gói sau để đăng ký dùng thử
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            {" "}
            miễn phí
          </span>
        </h1>
        <p className="font-normal">
          Dùng thử
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            {" "}
            Infinity Pro
          </span>{" "}
          trong vòng 14 ngày hoàn toàn miễn phí! Đẩy nhanh quá trình học tập của
          bạn.
        </p>
        <div className="w-full flex justify-between items-center">
          <Button type="ctaPremium">
            <Link to={"/payment"}>bắt đầu dùng thử 14 ngày miễn phí</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 trial__main__right">
        <div className="trial_table w-full mx-auto rounded-2xl backdrop-blur-sm flex flex-col gap-4 items-center justify-end">
          <div className="cursor-pointer w-[414px] flex flex-col items-start gap-8 rounded-2xl p-4 border-2 border-[#00F6FF]">
            <div className="font-bold text-white bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] p-2 rounded-lg">
              2-6 thành viên
            </div>
            <div className="text-slate-600 flex w-full items-center justify-between font-bold">
              <span className="text-[20px]">Gói đội nhóm</span>
              <span>12 tháng</span>
            </div>
            <div className="w-full flex justify-end font-bold text-slate-600">
              <span>247.999 / Tháng</span>
            </div>
          </div>
          <div className="cursor-pointer w-[414px] flex flex-col items-start gap-8 rounded-2xl p-4 border-2 ">
            <div className="font-bold text-white bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] p-2 rounded-lg">
              Thông dụng
            </div>
            <div className="text-slate-600 flex w-full items-center justify-between font-bold">
              <span className="text-[20px]">12 Tháng</span>
              <span>129.000 / tháng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrialComponent;
