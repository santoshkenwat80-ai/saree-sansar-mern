import { forwardRef } from "react";
export const Input = forwardRef(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);
    return <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>}
        <input
      id={inputId}
      ref={ref}
      className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930] focus:border-transparent transition-all ${error ? "border-rose-500 focus:ring-rose-500" : "border-stone-300"} ${className}`}
      {...props}
    />
        {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : helperText ? <p className="mt-1 text-xs text-stone-500">{helperText}</p> : null}
      </div>;
  }
);
Input.displayName = "Input";
