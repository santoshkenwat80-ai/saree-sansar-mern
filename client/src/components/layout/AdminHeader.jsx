import { useState } from "react";
import { Menu, Shield, Bell, BellRing } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export const AdminHeader = ({ onToggleMobile, onTestAlarm }) => {
  const { user } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);
  return <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
    onClick={onToggleMobile}
    className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-md"
    aria-label="Toggle menu"
  >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
          <Shield className="w-4 h-4 text-[#881930]" />
          <span>Saree Sansar Management Operations</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {
    /* Test Order Alarm Siren Button */
  }
        {onTestAlarm && <button
    type="button"
    onClick={onTestAlarm}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#881930] border border-rose-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
    title="ऑर्डर अलर्ट सायरन टेस्ट करें"
  >
            <BellRing className="w-3.5 h-3.5 text-rose-700 animate-pulse" />
            <span className="hidden sm:inline">अलार्म टेस्ट (Test Alarm)</span>
          </button>}

        {
    /* Notifications */
  }
        <div className="relative">
          <button
    onClick={() => setNotificationOpen(!notificationOpen)}
    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full relative"
    title="Notifications"
  >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#881930] rounded-full" />
          </button>

          {notificationOpen && <div
    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-stone-200 p-3 z-50 text-xs"
    onMouseLeave={() => setNotificationOpen(false)}
  >
              <p className="font-semibold text-stone-900 border-b pb-1.5 mb-2">
                Recent Alerts
              </p>
              <div className="space-y-2">
                <p className="text-stone-600">
                  New Order <span className="font-mono font-bold">#SS-ORD-9281</span> received (Paid via Razorpay).
                </p>
                <p className="text-stone-600">
                  Low stock alert: Shahi Dulhan Crimson Banarasi (4 units remaining).
                </p>
              </div>
            </div>}
        </div>

        {
    /* User Info */
  }
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6b1426] text-white flex items-center justify-center font-serif text-sm font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-stone-900 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-stone-400">Master Administrator</p>
          </div>
        </div>
      </div>
    </header>;
};
