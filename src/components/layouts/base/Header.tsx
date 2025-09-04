// @ts-nocheck
import { Link, NavLink } from "react-router-dom";
import Button from "../../reuseables/Button";
import Logo from "../Logo";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
import { PlusIcon } from "lucide-react";

function Header() {
  return (
    <header className="header px-5 py-4 border-b-2 border-slate-300 flex items-center justify-between ">
      <Logo />
      <div className="flex gap-6 items-center">
        <Button type="accent">
          <img
            src="/images/icons/crown.png"
            alt="Go pro icon"
            className="w-5 h-5"
          />
          <Link to="/trial">GO PRO</Link>
        </Button>
        {/* Language selection */}
        <Popover>
          <PopoverTrigger>
            <Button
              type="ghosted"
              className="w-10 h-10 hover:bg-transparent active:bg-transparent"
            >
              <img
                src="/images/flags/germany.png"
                alt="Current language"
                className="w-8 h-8 border-2 border-slate-300 rounded-full"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-background min-w-72 rounded-2xl p-0">
            <div className="flex-center gap-6 p-6 w-full">
              <div className="flex flex-col gap-2 items-center">
                <img
                  src="/images/flags/germany.png"
                  alt="Current language"
                  className="w-12 h-12 border-2 border-slate-300 rounded-full"
                />
                <h4 className="text-base be-vietnam-pro-bold capitalize text-slate-400">
                  Tiếng Đức
                </h4>
              </div>

              <NavLink
                to={"/khoa-hoc"}
                className={"flex flex-col items-center gap-2"}
              >
                <button className="p-2.5 rounded-full border-2 border-slate-300 hover:bg-slate-100 cursor-pointer">
                  <PlusIcon className="text-slate-400" />
                </button>
                <h4 className="text-base be-vietnam-pro-bold capitalize text-slate-400">
                  Thêm
                </h4>
              </NavLink>
            </div>
            <div className="w-full border-t-2 border-slate-300 p-2 flex-center">
              <p className="text-center be-vietnam-pro-bold text-slate-400">
                Danh sách khóa học
              </p>
            </div>
          </PopoverContent>
        </Popover>
        {/* Notification */}
        <img
          src="/images/icons/bell.png"
          alt="Notification icon"
          className="w-8 h-8 border-2 border-slate-300 rounded-full hover:bg-slate-100 cursor-pointer transition-all duration-200 ease-in-out"
        />
      </div>
    </header>
  );
}

export default Header;
