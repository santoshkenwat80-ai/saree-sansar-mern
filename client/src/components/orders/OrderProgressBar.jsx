import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Home,
  Ban,
  Check
} from "lucide-react";
const TRACKING_STEPS = [
  { key: "CONFIRMED", label: "Confirmed", sublabel: "Loom Verified", icon: CheckCircle2 },
  { key: "PACKED", label: "Packed", sublabel: "Silk Mark Boxed", icon: Package },
  { key: "SHIPPED", label: "Shipped", sublabel: "In Transit", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", sublabel: "With Courier", icon: MapPin },
  { key: "DELIVERED", label: "Delivered", sublabel: "Safely Arrived", icon: Home }
];
export const OrderProgressBar = ({ order, compact = false }) => {
  const isCancelled = order.orderStatus === "CANCELLED";
  const getStepProgress = () => {
    if (isCancelled) return { activeIndex: -1, percentage: 0 };
    switch (order.orderStatus) {
      case "PLACED":
        return { activeIndex: 0, percentage: 10 };
      case "CONFIRMED":
        return { activeIndex: 0, percentage: 20 };
      case "PACKED":
        return { activeIndex: 1, percentage: 40 };
      case "SHIPPED":
        return { activeIndex: 2, percentage: 65 };
      case "OUT_FOR_DELIVERY":
        return { activeIndex: 3, percentage: 85 };
      case "DELIVERED":
        return { activeIndex: 4, percentage: 100 };
      default:
        return { activeIndex: 0, percentage: 15 };
    }
  };
  const { activeIndex, percentage } = getStepProgress();
  if (isCancelled) {
    return <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-rose-900 block">Order Cancelled</span>
            <span className="text-rose-700 text-[11px]">
              {order.cancelReason || "Cancelled by customer request. Saree stock replenished."}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded bg-rose-200/80 text-rose-900 font-bold uppercase text-[10px] tracking-wider shrink-0">
          Cancelled
        </span>
      </div>;
  }
  const getTimelineTime = (stepKey) => {
    if (!order.timeline) return null;
    const item = order.timeline.find((t) => t.status === stepKey && t.completed);
    if (!item || item.timestamp === "Pending") return null;
    return item.timestamp;
  };
  return <div className={`w-full ${compact ? "py-2" : "py-3.5 sm:py-5"}`}>
      {
    /* Top Status & Expected Date Bar */
  }
      <div className="flex items-center justify-between text-xs mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-stone-900">
            Status:{" "}
            <span className="text-[#881930] font-bold">
              {order.orderStatus.replace(/_/g, " ")}
            </span>
          </span>
          {order.courierPartner && <span className="hidden sm:inline text-stone-400">
              · Courier: <strong className="text-stone-700 font-medium">{order.courierPartner}</strong>
            </span>}
        </div>

        {order.estimatedDelivery && order.orderStatus !== "DELIVERED" && <div className="text-[11px] sm:text-xs text-stone-600 bg-stone-100/90 px-2.5 py-1 rounded-lg">
            Expected by:{" "}
            <strong className="text-[#881930] font-semibold">{order.estimatedDelivery}</strong>
          </div>}
        {order.orderStatus === "DELIVERED" && <div className="text-[11px] sm:text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            Delivered Successfully
          </div>}
      </div>

      {
    /* The Visual Progress Track */
  }
      <div className="relative">
        {
    /* Background Grey Rail */
  }
        <div className="absolute top-4 sm:top-4.5 left-4 right-4 sm:left-6 sm:right-6 h-1 sm:h-1.5 bg-stone-200 rounded-full -translate-y-1/2 z-0" />

        {
    /* Animated Filled Progress Rail */
  }
        <div
    className="absolute top-4 sm:top-4.5 left-4 sm:left-6 h-1 sm:h-1.5 bg-gradient-to-r from-[#6b1426] via-[#881930] to-[#d4af37] rounded-full -translate-y-1/2 transition-all duration-700 ease-out z-0 shadow-xs"
    style={{ width: `calc(${percentage}% - 1.5rem)` }}
  />

        {
    /* Step Nodes Row */
  }
        <div className="relative z-10 flex items-start justify-between">
          {TRACKING_STEPS.map((step, idx) => {
    const isCompleted = idx < activeIndex || order.orderStatus === "DELIVERED";
    const isCurrent = idx === activeIndex && order.orderStatus !== "DELIVERED";
    const Icon = step.icon;
    const time = getTimelineTime(step.key);
    return <div
      key={step.key}
      className="flex flex-col items-center text-center group cursor-default"
      style={{ width: `${100 / TRACKING_STEPS.length}%` }}
    >
                {
      /* Milestone Node Circle */
    }
                <div
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs ${isCompleted ? "bg-[#881930] text-white ring-4 ring-rose-100" : isCurrent ? "bg-white text-[#881930] border-2 border-[#881930] ring-4 ring-[#881930]/20 scale-105" : "bg-stone-100 text-stone-400 border border-stone-300"}`}
      title={`${step.label}: ${step.sublabel}`}
    >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                </div>

                {
      /* Milestone Labels */
    }
                <div className="mt-2 space-y-0.5 max-w-[70px] sm:max-w-[100px]">
                  <p
      className={`text-[11px] sm:text-xs font-semibold leading-tight ${isCurrent ? "text-[#881930] font-bold" : isCompleted ? "text-stone-900" : "text-stone-400"}`}
    >
                    {step.label}
                  </p>
                  <p className="hidden sm:block text-[10px] text-stone-500 leading-none">
                    {step.sublabel}
                  </p>
                  {time && <p className="hidden md:block text-[9px] font-mono text-stone-400 pt-0.5 truncate">
                      {time.split(",")[0]}
                    </p>}
                </div>
              </div>;
  })}
        </div>
      </div>
    </div>;
};
export default OrderProgressBar;
