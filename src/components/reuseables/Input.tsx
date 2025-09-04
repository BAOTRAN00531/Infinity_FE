// @ts-nocheck
import { cn } from "../../lib/utils";

function Input({ label, value, id, className, disabled, ...props }) {
  return (
    <div className="be-vietnam-pro-regular flex flex-col gap-2 w-full">
      <label htmlFor={id || "input"} className="text-slate-600 font-black">
        {label || "Sample label"}
      </label>
      <input
        type="text"
        id={id || "input"}
        value={value || ""}
        disabled={disabled}
        className={cn([
          "px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-slate-600 placeholder:text-slate-300",
          "focus:outline-2 focus:outline-primary",
          className,
        ])}
        {...props}
      />
      <span></span>
    </div>
  );
}

export default Input;
