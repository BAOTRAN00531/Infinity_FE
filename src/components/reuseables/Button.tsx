// @ts-nocheck
import { cn } from "../../lib/utils";

function Button({
  className = "",
  children,
  onclick = () => {},
  onSubmit = () => {},
  type = "primary",
  disabled = false,
}) {
  const buttonStyles = {
    primary: "bg-primary shadow-primary text-white",
    secondary: "bg-background text-slate-600 shadow-secondary",
    accent: "bg-accent text-white shadow-accent",
    cta: "bg-background text-primary shadow-secondary",
    ctaPremium: "bg-background text-premium-gradient shadow-secondary",
    muted: "bg-slate-100 shadow-muted text-slate-300",
    danger: "bg-red-400 shadow-danger text-white",
    ghosted: "bg-transparent text-slate-300 shadow-none hover:bg-slate-100",
  };

  return (
    <button
      disabled={disabled}
      type="button"
      className={cn([
        "py-2.5 px-4 flex-center gap-2.5 text-md be-vietnam-pro-black uppercase rounded-2xl transition-all duration-200 cursor-pointer min-w-max max-w-max",
        "active:shadow-none active:translate-y-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        buttonStyles[type] || buttonStyles.primary,
        className,
      ])}
      onClick={onclick}
      onSubmit={onSubmit}
    >
      {children}
    </button>
  );
}

export default Button;
