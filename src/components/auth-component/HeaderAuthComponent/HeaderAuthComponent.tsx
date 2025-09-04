// @ts-nocheck
import React from "react";
import Logo from "../../layouts/Logo";
import Button from "../../reuseables/Button";
import { useNavigate } from "react-router-dom";

const HeaderAuthComponent = (props) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-[50px]">
      <Logo></Logo>
      <Button
        onclick={() => {
          props.action == "login"
            ? navigate("/auth/register")
            : navigate("/auth/login");
        }}
        type="cta"
      >
        {props.action == "login"
          ? "Tạo Tài Khoản"
          : props.action == "register"
          ? "Đăng nhập"
          : "Đăng nhập"}
      </Button>
    </header>
  );
};

export default HeaderAuthComponent;
