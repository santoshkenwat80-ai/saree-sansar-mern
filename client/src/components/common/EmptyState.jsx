import { Button } from "./Button";
export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return <div className="py-16 px-4 text-center max-w-md mx-auto">
      {icon && <div className="mx-auto w-16 h-16 flex items-center justify-center text-stone-400 mb-4 bg-stone-100 rounded-full">{icon}</div>}
      <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>}
    </div>;
};
export const Loader = ({ message = "Loading royal collection..." }) => {
  return <div className="py-20 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 border-3 border-amber-200 border-t-[#6b1426] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-stone-600 tracking-wide">{message}</p>
    </div>;
};
