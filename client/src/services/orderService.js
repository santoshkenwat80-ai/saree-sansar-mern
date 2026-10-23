import apiClient from "./api";
import { INITIAL_ORDERS } from "./mockData";
const LOCAL_ORDERS_KEY = "saree_sansar_orders_db";
const getStoredOrders = () => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed reading orders", e);
  }
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};
const saveStoredOrders = (orders) => {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};
export const broadcastNewOrderToAdmin = (order) => {
  try {
    localStorage.setItem("saree_sansar_latest_order_alert", JSON.stringify(order));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("new-order-placed", { detail: order }));
    }
  } catch (e) {
    console.warn("Failed broadcasting order alert", e);
  }
};
export const orderService = {
  async getMyOrders(userId, userEmail) {
    try {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (userEmail) params.set("userEmail", userEmail);
      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await apiClient.get(`/orders/my-orders${queryStr}`);
      return res.data;
    } catch {
      const orders = getStoredOrders();
      if (!userId && !userEmail) return orders;
      return orders.filter(
        (o) => userId && o.userId === userId || userEmail && o.userEmail?.toLowerCase() === userEmail?.toLowerCase()
      );
    }
  },
  async getAllOrders() {
    try {
      const res = await apiClient.get("/orders");
      return res.data;
    } catch {
      return getStoredOrders();
    }
  },
  async getOrderById(id) {
    const cleanId = (id || "").trim();
    if (!cleanId) return null;
    const lowerId = cleanId.toLowerCase();
    try {
      const res = await apiClient.get(`/orders/${encodeURIComponent(cleanId)}`);
      return res.data;
    } catch {
      const orders = getStoredOrders();
      return orders.find(
        (o) => o.id === cleanId || o.id?.toLowerCase() === lowerId || o.orderNumber?.toLowerCase() === lowerId || o.trackingNumber?.toLowerCase() === lowerId || /^\d{3,6}$/.test(cleanId) && o.orderNumber?.includes(cleanId)
      ) || null;
    }
  },
  async createRazorpayOrder(amount) {
    try {
      const res = await apiClient.post("/payments/create-razorpay-order", { amount });
      return res.data;
    } catch {
      return {
        razorpayOrderId: `order_${Math.random().toString(36).substring(2, 12)}`,
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_saree_sansar_dummy",
        amount: Math.round(amount * 100),
        // in paise
        currency: "INR"
      };
    }
  },
  async verifyPayment(paymentData) {
    try {
      const res = await apiClient.post("/payments/verify", paymentData);
      return res.data;
    } catch {
      const orders = getStoredOrders();
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
        userId: paymentData.orderData.userId || "usr-customer-1",
        userEmail: paymentData.orderData.userEmail || "customer@sareesansar.com",
        userName: paymentData.orderData.userName || "Valued Patron",
        items: paymentData.orderData.items || [],
        subtotal: paymentData.orderData.subtotal || 0,
        discount: paymentData.orderData.discount || 0,
        couponCode: paymentData.orderData.couponCode,
        shippingFee: paymentData.orderData.shippingFee || 0,
        tax: paymentData.orderData.tax || 0,
        totalAmount: paymentData.orderData.totalAmount || 0,
        paymentMethod: paymentData.orderData.paymentMethod || "RAZORPAY",
        paymentStatus: "PAID",
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpayOrderId: paymentData.razorpayOrderId,
        orderStatus: "CONFIRMED",
        shippingAddress: paymentData.orderData.shippingAddress,
        trackingNumber: `EXP-IN-${Math.floor(1e6 + Math.random() * 9e6)}`,
        courierPartner: "BlueDart Express",
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        timeline: [
          {
            status: "PLACED",
            title: "Order Placed",
            description: "Payment successfully captured via Razorpay.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Confirmed",
            description: "Order sent to master weavers workshop.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "PACKED",
            title: "Silk Mark Inspection & Packaging",
            description: "Packed in signature luxury gift box.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "SHIPPED",
            title: "Dispatched with Courier",
            description: "Tracking number assigned.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "OUT_FOR_DELIVERY",
            title: "Out for Delivery",
            description: "Will arrive with customer confirmation.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "DELIVERED",
            title: "Delivered",
            description: "Package delivered.",
            timestamp: "Pending",
            completed: false
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(newOrder);
      saveStoredOrders(orders);
      broadcastNewOrderToAdmin(newOrder);
      return { success: true, order: newOrder };
    }
  },
  async createCodOrder(orderData) {
    try {
      const res = await apiClient.post("/orders/cod", orderData);
      const order = res.data?.order || res.data;
      broadcastNewOrderToAdmin(order);
      return order;
    } catch {
      const orders = getStoredOrders();
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
        userId: orderData.userId || "usr-customer-1",
        userEmail: orderData.userEmail || "customer@sareesansar.com",
        userName: orderData.userName || "Valued Patron",
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        couponCode: orderData.couponCode,
        shippingFee: orderData.shippingFee || 0,
        tax: orderData.tax || 0,
        totalAmount: orderData.totalAmount || 0,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        shippingAddress: orderData.shippingAddress,
        trackingNumber: `COD-IN-${Math.floor(1e6 + Math.random() * 9e6)}`,
        courierPartner: "Delhivery Surface",
        estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        timeline: [
          {
            status: "PLACED",
            title: "COD Order Placed",
            description: "Pay cash or UPI upon delivery.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Confirmed",
            description: "Patron phone verified.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(newOrder);
      saveStoredOrders(orders);
      broadcastNewOrderToAdmin(newOrder);
      return newOrder;
    }
  },
  async createUpiOrder(orderData) {
    try {
      const res = await apiClient.post("/orders/upi", orderData);
      const order = res.data?.order || res.data;
      broadcastNewOrderToAdmin(order);
      return order;
    } catch {
      const orders = getStoredOrders();
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
        userId: orderData.userId || "usr-customer-1",
        userEmail: orderData.userEmail || "customer@sareesansar.com",
        userName: orderData.userName || "Valued Patron",
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        couponCode: orderData.couponCode,
        shippingFee: orderData.shippingFee || 0,
        tax: orderData.tax || 0,
        totalAmount: orderData.totalAmount || 0,
        paymentMethod: "UPI",
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        shippingAddress: orderData.shippingAddress,
        trackingNumber: `UPI-EXP-${Math.floor(1e6 + Math.random() * 9e6)}`,
        courierPartner: "BlueDart Air Express",
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        timeline: [
          {
            status: "PLACED",
            title: "UPI Payment Confirmed",
            description: `Payment captured via UPI (${orderData.upiId || "Direct UPI Intent"}).`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Confirmed",
            description: "Direct dispatch priority assigned.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(newOrder);
      saveStoredOrders(orders);
      broadcastNewOrderToAdmin(newOrder);
      return newOrder;
    }
  },
  async updateOrderStatus(id, status) {
    try {
      const res = await apiClient.patch(`/orders/${id}/status`, { status });
      return res.data;
    } catch {
      const orders = getStoredOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      order.orderStatus = status;
      const timelineIdx = order.timeline.findIndex((t) => t.status === status);
      if (timelineIdx !== -1) {
        order.timeline[timelineIdx].completed = true;
        order.timeline[timelineIdx].timestamp = (/* @__PURE__ */ new Date()).toLocaleString("en-IN");
      }
      saveStoredOrders(orders);
      return order;
    }
  },
  async cancelOrder(id, reason) {
    const cleanId = (id || "").trim();
    if (!cleanId) throw new Error("Order identifier is required for cancellation");
    try {
      const res = await apiClient.post(`/orders/${encodeURIComponent(cleanId)}/cancel`, { reason });
      const updatedOrder = res.data?.order || res.data;
      try {
        const orders = getStoredOrders();
        const idx = orders.findIndex(
          (o) => o.id === cleanId || o.orderNumber?.toLowerCase() === cleanId.toLowerCase() || o.orderNumber === updatedOrder?.orderNumber
        );
        if (idx !== -1) {
          orders[idx] = { ...orders[idx], ...updatedOrder, orderStatus: "CANCELLED" };
          saveStoredOrders(orders);
        }
      } catch {
      }
      return updatedOrder;
    } catch (e) {
      const orders = getStoredOrders();
      const lowerId = cleanId.toLowerCase();
      const order = orders.find(
        (o) => o.id === cleanId || o.orderNumber?.toLowerCase() === lowerId || o.trackingNumber?.toLowerCase() === lowerId || /^\d{3,6}$/.test(cleanId) && o.orderNumber?.includes(cleanId)
      );
      if (!order) throw new Error(e.response?.data?.error || "Order not found");
      order.orderStatus = "CANCELLED";
      order.timeline = order.timeline || [];
      order.timeline.push({
        status: "CANCELLED",
        title: "Order Cancelled by Customer",
        description: reason || "Cancelled by patron request.",
        timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
        completed: true
      });
      saveStoredOrders(orders);
      return order;
    }
  }
};
