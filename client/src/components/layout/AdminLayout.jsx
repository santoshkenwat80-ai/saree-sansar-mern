import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminOrderAlarmModal } from "../admin/AdminOrderAlarmModal";
import { orderService } from "../../services/orderService";
import toast from "react-hot-toast";
export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeAlertOrder, setActiveAlertOrder] = useState(null);
  const knownOrderIdsRef = useRef(/* @__PURE__ */ new Set());
  const isInitialLoadRef = useRef(true);
  useEffect(() => {
    let isMounted = true;
    const checkOrders = async () => {
      try {
        const orders = await orderService.getAllOrders();
        if (!isMounted) return;
        if (isInitialLoadRef.current) {
          orders.forEach((o) => knownOrderIdsRef.current.add(o.id));
          isInitialLoadRef.current = false;
          return;
        }
        const newOrders = orders.filter((o) => !knownOrderIdsRef.current.has(o.id));
        if (newOrders.length > 0) {
          const newest = newOrders[0];
          newOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
          setActiveAlertOrder(newest);
          toast.success(`\u{1F6A8} \u0928\u092F\u093E \u0911\u0930\u094D\u0921\u0930 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u0941\u0906: ${newest.orderNumber}! \u0905\u0932\u093E\u0930\u094D\u092E \u092C\u091C \u0930\u0939\u093E \u0939\u0948!`, {
            duration: 6e3,
            icon: "\u{1F514}"
          });
        }
      } catch (err) {
      }
    };
    checkOrders();
    const interval = setInterval(checkOrders, 4e3);
    const handleNewOrderEvent = (e) => {
      const order = e.detail;
      if (order && !knownOrderIdsRef.current.has(order.id)) {
        knownOrderIdsRef.current.add(order.id);
        setActiveAlertOrder(order);
      }
    };
    const handleStorageEvent = (e) => {
      if (e.key === "saree_sansar_latest_order_alert" && e.newValue) {
        try {
          const order = JSON.parse(e.newValue);
          if (order && !knownOrderIdsRef.current.has(order.id)) {
            knownOrderIdsRef.current.add(order.id);
            setActiveAlertOrder(order);
          }
        } catch {
        }
      }
    };
    window.addEventListener("new-order-placed", handleNewOrderEvent);
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("new-order-placed", handleNewOrderEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);
  const handleTestAlarm = () => {
    const mockOrder = {
      id: `ord-test-${Date.now()}`,
      orderNumber: `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
      userId: "usr-santosh-test",
      userEmail: "santosh@sareesansar.com",
      userName: "Santosh Kumar Kenwat",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          product: {
            id: "prod-1",
            name: "Shahi Dulhan Crimson Banarasi Katan Silk",
            slug: "shahi-dulhan-crimson-banarasi-katan-silk",
            description: "Pure Katan silk bridal drape with tested gold zari brocade work.",
            price: 18999,
            originalPrice: 24999,
            discountPercent: 24,
            category: "Banarasi Silk",
            fabric: "Pure Katan Silk",
            images: ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"],
            stock: 12,
            sku: "BAN-001",
            rating: 5,
            reviewsCount: 38,
            color: "Crimson Red",
            occasion: "BRIDAL",
            blousePieceIncluded: true,
            sareeLength: "5.5m + 0.8m blouse piece",
            careInstructions: "Dry clean only",
            specifications: {},
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          quantity: 1
        }
      ],
      subtotal: 18999,
      discount: 0,
      shippingFee: 0,
      tax: 950,
      totalAmount: 19949,
      paymentMethod: "UPI",
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
      shippingAddress: {
        id: "addr-1",
        fullName: "Santosh Kumar Kenwat",
        phone: "6267961163",
        pincode: "492001",
        state: "Chhattisgarh",
        city: "Raipur",
        addressLine: "Civil Lines, Near Raj Bhavan",
        locality: "Civil Lines",
        type: "HOME",
        isDefault: true
      },
      trackingNumber: "UPI-EXP-8921102",
      courierPartner: "BlueDart Express",
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      timeline: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setActiveAlertOrder(mockOrder);
    toast.success("\u{1F514} \u090F\u0921\u092E\u093F\u0928 \u0911\u0930\u094D\u0921\u0930 \u0905\u0932\u093E\u0930\u094D\u092E \u092C\u091C \u0930\u0939\u093E \u0939\u0948! (Alarm Ringing)", { icon: "\u{1F6A8}" });
  };
  return <div className="min-h-screen flex bg-stone-100">
      {
    /* Desktop Sidebar */
  }
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {
    /* Mobile Drawer */
  }
      {mobileSidebarOpen && <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
    className="fixed inset-0 bg-stone-900/60"
    onClick={() => setMobileSidebarOpen(false)}
  />
          <div className="relative w-64 h-full z-10">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>}

      {
    /* Main Content Area */
  }
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
    onToggleMobile={() => setMobileSidebarOpen(true)}
    onTestAlarm={handleTestAlarm}
  />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {
    /* Global Order Alarm Modal & Sound Siren */
  }
      <AdminOrderAlarmModal
    order={activeAlertOrder}
    onClose={() => setActiveAlertOrder(null)}
  />
    </div>;
};
