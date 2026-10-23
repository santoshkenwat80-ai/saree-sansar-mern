import { useEffect } from "react";
import { X } from "lucide-react";
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md"
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
    onClick={onClose}
  />
        <div
    className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full my-8 ${maxWidthStyles[maxWidth]} border border-stone-200`}
  >
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/50">
            <h3 className="text-lg font-serif font-semibold text-stone-900">{title}</h3>
            <button
    onClick={onClose}
    className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
    aria-label="Close modal"
  >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>;
};
