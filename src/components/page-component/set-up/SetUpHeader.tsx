// @ts-nocheck
import Logo from "../../layouts/Logo";
import Button from "../../reuseables/Button";

function SetUpHeader() {
  return (
    <header className="mt-8 flex items-center justify-between px-5">
      <Logo />
      <Button type="cta">Tạo tài khoản</Button>
    </header>
  );
}

export default SetUpHeader;
