export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap shrink-0 active:scale-[0.99]";
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-md min-h-[36px]",
    md: "text-sm px-4 py-2 rounded-md min-h-[42px]",
    lg: "text-base px-6 py-3 rounded-lg min-h-[48px]"
  };
  const variantStyles = {
    primary: "bg-[#6b1426] text-white hover:bg-[#520f1d] focus-visible:ring-[#881930] shadow-sm",
    secondary: "bg-[#f5eedf] text-[#4a0e1b] hover:bg-[#ebd9c3] focus-visible:ring-[#c59b27]",
    outline: "border border-stone-300 text-stone-800 bg-transparent hover:bg-stone-50 focus-visible:ring-stone-400",
    ghost: "text-stone-700 bg-transparent hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-400",
    danger: "bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-500 shadow-sm"
  };
  return <button
    className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
      {isLoading ? <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
          </svg>
          <span>Processing...</span>
        </span> : children}
    </button>;
};
