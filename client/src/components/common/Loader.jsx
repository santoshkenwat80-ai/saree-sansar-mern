export const Loader = ({
  message = "Loading royal collection..."
}) => {
  return <div className="py-20 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 border-3 border-amber-200 border-t-[#6b1426] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-stone-600 tracking-wide">{message}</p>
    </div>;
};
