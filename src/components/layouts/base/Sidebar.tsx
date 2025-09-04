// @ts-nocheck
import { NavLink } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import React from "react";

const iconPath = "/images/icons/sidebar";

const sidebarItems = [
  {
    title: "Học",
    icon: `${iconPath}/learn.png`,
    link: "/hoc",
  },
  {
    title: "Phát âm",
    icon: `${iconPath}/pronun.png`,
    link: "/phat-am",
  },
  {
    title: "Hồ sơ",
    icon: `${iconPath}/profile.png`,
    link: "/ho-so",
  },
];

const themeIconPath = "/images/icons/theme";

const themeOptions = [
  {
    value: "light",
    label: "Chế độ sáng",
    icon: `${themeIconPath}/light-mode.svg`,
  },
  {
    value: "dark",
    label: "Chế độ tối",
    icon: `${themeIconPath}/dark-mode.svg`,
  },
  { value: "system", label: "Hệ thống", icon: `${themeIconPath}/system.svg` },
];

function Sidebar() {
  const [theme, setTheme] = React.useState("system");

  const handleThemeChange = (value) => {
    setTheme(value);
    document.documentElement.setAttribute("data-theme", value);
  };

  return (
    <aside className="w-64 bg-background p-4 h-full flex flex-col justify-between">
      <nav>
        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-primary active:shadow-none active:translate-y-1"
                      : "hover:bg-muted *:text-slate-600"
                  }`
                }
              >
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className="w-6 h-6"
                />
                <span className={`be-vietnam-pro-black uppercase`}>
                  {item.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Select */}
      <Select value={theme} onValueChange={handleThemeChange} className="mt-6">
        <SelectTrigger className="w-full  border-2 border-slate-300">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={"hover:bg-background cursor-pointer"}
            >
              <div className="flex items-center gap-2">
                <img
                  src={option.icon}
                  alt={`${option.label} icon`}
                  className="w-5 h-5"
                />
                <span className="be-vietnam-pro-black text-slate-600">
                  {option.label}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </aside>
  );
}

export default Sidebar;
