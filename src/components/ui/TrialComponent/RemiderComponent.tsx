// @ts-nocheck
import React from "react";
import Button from "../../reuseables/Button";
import "./Trial.scss";
import { Link } from "react-router-dom";

const RemiderComponent = () => {
  return (
    <div className="w-full h-full flex justify-between items-center gap-[200px]">
      <div className="flex flex-col gap-[38px] flex-1">
        <h1 className="uppercase font-[900] text-4xl text-slate-600">
          Chúng tôi sẽ nhắc bạn{" "}
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            {" "}
            2 ngày
          </span>{" "}
          trước khi hết hạn dùng thử
        </h1>
        <p className="font-normal">
          Đừng quên kiểm tra email hoặc thông báo từ chúng tôi nhé!
        </p>
        <div className="w-full flex justify-between items-center">
          <Button type="ctaPremium">
            <Link to={"/plan-trial"}> bắt đầu 14 ngày dùng thử miễn phí</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 trial__main__right">
        <div className="trial_table w-full mx-auto rounded-2xl backdrop-blur-sm flex items-center justify-end">
          <img className="" src="/images/alarm 1.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default RemiderComponent;
