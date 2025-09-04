// @ts-nocheck
import React from "react";
import "./FooterFormComponent/FooterForm.scss";
import Button from "../../reuseables/Button";

const FooterForm = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="footer__form--or text-slate-300 flex items-center justify-between gap-[15px]">
        <span className="footer__form--line bg-slate-300 h-[1px] flex-1"></span>
        <span>hoặc</span>
        <span className="footer__form--line bg-slate-300 h-[1px] flex-1"></span>
      </div>
      <div className="flex justify-between">
        <Button
          className="font-[900] text-[16px] uppercase text-slate-600"
          type="cta"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M12.5 22.5C18.299 22.5 23 17.799 23 12C23 6.20101 18.299 1.5 12.5 1.5C6.70101 1.5 2 6.20101 2 12C2 17.799 6.70101 22.5 12.5 22.5Z"
              fill="url(#paint0_linear_74_859)"
            />
            <path
              d="M16.4103 15.2112L16.8767 12.2476H13.9589V10.3253C13.9589 9.51428 14.3658 8.72332 15.6726 8.72332H17V6.20024C17 6.20024 15.7959 6 14.6452 6C12.2411 6 10.6713 7.41971 10.6713 9.9888V12.2476H8V15.2112H10.6713V22.3759C11.2075 22.458 11.7562 22.5 12.3151 22.5C12.874 22.5 13.4226 22.458 13.9589 22.3759V15.2112H16.4103Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_74_859"
                x1="12.5"
                y1="1.5"
                x2="12.5"
                y2="22.4378"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#18ACFE" />
                <stop offset="1" stop-color="#0163E0" />
              </linearGradient>
            </defs>
          </svg>
          Facebook
        </Button>
        <Button
          className="font-[900] text-[16px] uppercase text-slate-600"
          type="cta"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <g clip-path="url(#clip0_74_851)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.01847 11.0003C5.01847 10.3334 5.12922 9.69408 5.3269 9.09442L1.8668 6.45215C1.19244 7.82135 0.8125 9.36415 0.8125 11.0003C0.8125 12.635 1.19197 14.1769 1.86539 15.5451L5.32363 12.8977C5.12782 12.3009 5.01847 11.6639 5.01847 11.0003Z"
                fill="#FBBC05"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.0941 4.9334C12.5429 4.9334 13.8514 5.44673 14.8795 6.28673L17.8704 3.30007C16.0478 1.7134 13.7112 0.733398 11.0941 0.733398C7.03118 0.733398 3.53929 3.05693 1.86719 6.45193L5.3273 9.0942C6.12456 6.67407 8.39718 4.9334 11.0941 4.9334Z"
                fill="#EB4335"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.0941 17.0666C8.39718 17.0666 6.12456 15.3259 5.3273 12.9058L1.86719 15.5476C3.53929 18.943 7.03118 21.2666 11.0941 21.2666C13.6018 21.2666 15.996 20.3762 17.7928 18.7078L14.5085 16.1687C13.5817 16.7525 12.4148 17.0666 11.0941 17.0666Z"
                fill="#34A853"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.9077 11C20.9077 10.3933 20.8142 9.73997 20.674 9.1333H11.0938V13.1H16.6082C16.3325 14.4524 15.582 15.4921 14.5081 16.1688L17.7925 18.7079C19.68 16.956 20.9077 14.3464 20.9077 11Z"
                fill="#4285F4"
              />
            </g>
            <defs>
              <clipPath id="clip0_74_851">
                <rect
                  width="21"
                  height="21"
                  fill="white"
                  transform="translate(0.5 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          Google
        </Button>
      </div>
      <span className="font-normal text-slate-600 text-center">
        Bằng việc đăng ký tài khoản tại Infinity, bạn đồng ý với các{" "}
        <span className="font-bold">Điều khoản </span>
        và <span className="font-bold">Chính sách</span> của chúng tôi
      </span>
    </div>
  );
};

export default FooterForm;
