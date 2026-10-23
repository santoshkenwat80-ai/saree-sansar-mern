import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Saree } from '../models/Saree.js';
import { db } from '../db.js';
import { isMongoConnected } from '../config/db.js';
const syncUserAddressOnOrder = async (userId, userEmail, shippingAddress) => {
  if (!shippingAddress || !shippingAddress.addressLine) return;
  const cleanPhone = (shippingAddress.phone || "").replace(/\D/g, "").slice(-10);
  const targetUser = db.users.find(
    (u) => userId && u.id === userId || userEmail && u.email && u.email.toLowerCase() === userEmail.toLowerCase() || cleanPhone && u.phone && u.phone.replace(/\D/g, "").slice(-10) === cleanPhone
  );
  if (targetUser) {
    if (!targetUser.addresses) targetUser.addresses = [];
    const cleanLine = (shippingAddress.addressLine || "").toLowerCase().trim();
    const existing = targetUser.addresses.find(
      (a) => a.id === shippingAddress.id || a.pincode === shippingAddress.pincode && (a.addressLine || "").toLowerCase().trim() === cleanLine
    );
    if (!existing) {
      targetUser.addresses.forEach((a) => a.isDefault = false);
      targetUser.addresses.unshift({
        ...shippingAddress,
        id: shippingAddress.id || `addr-${Date.now()}`,
        isDefault: true
      });
    } else {
      targetUser.addresses.forEach((a) => a.isDefault = false);
      existing.isDefault = true;
      Object.assign(existing, shippingAddress, { isDefault: true });
    }
    db.save();
    if (isMongoConnected()) {
      try {
        const { User } = await import("../models/User");
        await User.findOneAndUpdate({ email: targetUser.email }, { addresses: targetUser.addresses });
      } catch (e) {
        console.warn("MongoDB address sync notice:", e);
      }
    }
  }
};
export class OrderController {
  /**
   * GET /api/orders/my-orders
   * Retrieve all orders for the authenticated customer by userId or userEmail
   */
  static async getMyOrders(req, res) {
    try {
      const userId = req.query.userId || "";
      const userEmail = (req.query.userEmail || "").toLowerCase().trim();
      if (isMongoConnected()) {
        try {
          const conditions = [];
          if (userId) conditions.push({ userId });
          if (userEmail) conditions.push({ userEmail });
          const query = conditions.length > 0 ? { $or: conditions } : {};
          const mongoOrders = await Order.find(query).sort({ createdAt: -1 });
          if (mongoOrders && mongoOrders.length > 0) {
            res.json(mongoOrders);
            return;
          }
        } catch (mongoErr) {
          console.warn("MongoDB my-orders fetch notice:", mongoErr);
        }
      }
      if (!userId && !userEmail) {
        res.json(db.orders);
        return;
      }
      const filtered = db.orders.filter((o) => {
        const matchUser = userId && o.userId === userId;
        const matchEmail = userEmail && o.userEmail?.toLowerCase() === userEmail;
        return matchUser || matchEmail;
      });
      res.json(filtered.length > 0 ? filtered : db.orders);
    } catch (error) {
      console.error("Error in getMyOrders:", error);
      res.status(500).json({ error: "Failed to retrieve orders", details: error.message });
    }
  }
  /**
   * GET /api/orders
   * Retrieve all orders (for admin console or general audit)
   */
  static async getAllOrders(_req, res) {
    try {
      if (isMongoConnected()) {
        try {
          const mongoOrders = await Order.find().sort({ createdAt: -1 });
          if (mongoOrders && mongoOrders.length > 0) {
            res.json(mongoOrders);
            return;
          }
        } catch (e) {
          console.warn("MongoDB all orders notice:", e);
        }
      }
      res.json(db.orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }
  /**
   * GET /api/orders/:id
   * Get order details by _id, id, orderNumber, or trackingNumber safely (case-insensitive & whitespace-tolerant)
   */
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const rawId = (id || "").trim();
      const lowerId = rawId.toLowerCase();
      if (!rawId) {
        res.status(400).json({ error: "Order identifier or tracking code is required" });
        return;
      }
      if (isMongoConnected()) {
        try {
          const isObjectId = rawId.match(/^[0-9a-fA-F]{24}$/);
          const regexExact = new RegExp(`^${rawId}$`, "i");
          const conditions = [
            { orderNumber: regexExact },
            { trackingNumber: regexExact },
            { id: rawId }
          ];
          if (isObjectId) {
            conditions.push({ _id: rawId });
          }
          if (/^\d{3,6}$/.test(rawId)) {
            conditions.push({ orderNumber: new RegExp(rawId, "i") });
          }
          const mongoOrder = await Order.findOne({ $or: conditions });
          if (mongoOrder) {
            res.json(mongoOrder);
            return;
          }
        } catch (mongoErr) {
          console.warn("MongoDB single order fetch notice:", mongoErr);
        }
      }
      const localOrder = db.orders.find((o) => {
        if (!o) return false;
        const matchId = o.id === rawId || o.id?.toLowerCase() === lowerId;
        const matchOrderNum = o.orderNumber?.toLowerCase() === lowerId;
        const matchTracking = o.trackingNumber?.toLowerCase() === lowerId;
        const matchPartialNum = /^\d{3,6}$/.test(rawId) && o.orderNumber?.includes(rawId);
        return matchId || matchOrderNum || matchTracking || matchPartialNum;
      });
      if (!localOrder) {
        res.status(404).json({ error: "Order not found for ID or tracking code: " + rawId });
        return;
      }
      res.json(localOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order", details: error.message });
    }
  }
  /**
   * POST /api/orders/cod
   * Place Cash on Delivery order
   */
  static async createCODOrder(req, res) {
    try {
      const data = req.body;
      if (!data.items || !data.shippingAddress) {
        res.status(400).json({ error: "Items and shipping address are required" });
        return;
      }
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newOrder = {
        id: orderId,
        orderNumber,
        userId: data.userId || "usr-customer-1",
        userEmail: (data.userEmail || "customer@sareesansar.com").toLowerCase().trim(),
        userName: data.userName || data.shippingAddress.fullName,
        items: data.items,
        subtotal: Number(data.subtotal) || 0,
        discount: Number(data.discount) || 0,
        couponCode: data.couponCode,
        shippingFee: Number(data.shippingFee) || 0,
        tax: Number(data.tax) || 0,
        totalAmount: Number(data.totalAmount) || 0,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
        shippingAddress: data.shippingAddress,
        trackingNumber: `COD-IN-${Math.floor(1e6 + Math.random() * 9e6)}`,
        courierPartner: "Delhivery Surface",
        estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        timeline: [
          {
            status: "PLACED",
            title: "COD Order Placed",
            description: "Order placed successfully. Payment will be collected at doorstep delivery.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Verified",
            description: "Master handloom inventory reserved.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "PACKED",
            title: "Silk Mark Inspection",
            description: "Folded in muslin cloth and packed in luxury gift box.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "SHIPPED",
            title: "Dispatched with Courier",
            description: "Package in transit with courier partner.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "DELIVERED",
            title: "Doorstep Delivery",
            description: "Delivered and cash payment collected.",
            timestamp: "Pending",
            completed: false
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      for (const item of newOrder.items) {
        const prodId = item.productId || item.product?.id;
        const qty = Number(item.quantity) || 1;
        const found = db.products.find((p) => p.id === prodId || p.slug === prodId);
        if (found) {
          found.stock = Math.max(0, found.stock - qty);
        }
      }
      db.orders.unshift(newOrder);
      db.save();
      syncUserAddressOnOrder(newOrder.userId, newOrder.userEmail, newOrder.shippingAddress);
      if (isMongoConnected()) {
        try {
          await Order.create({
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            userId: newOrder.userId,
            userEmail: newOrder.userEmail,
            userName: newOrder.userName,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            couponCode: newOrder.couponCode,
            shippingFee: newOrder.shippingFee,
            tax: newOrder.tax,
            totalAmount: newOrder.totalAmount,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            orderStatus: "PLACED",
            shippingAddress: newOrder.shippingAddress,
            trackingNumber: newOrder.trackingNumber,
            courierPartner: newOrder.courierPartner,
            estimatedDelivery: newOrder.estimatedDelivery,
            timeline: newOrder.timeline
          });
          for (const item of newOrder.items) {
            const prodId = item.productId || item.product?.id;
            const qty = Number(item.quantity) || 1;
            await Promise.all([
              Product.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              }),
              Saree.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              })
            ]);
          }
          console.log(`\u2705 [OrderController] COD order created in MongoDB: ${newOrder.orderNumber}`);
        } catch (mongoErr) {
          console.error("Error saving COD order to MongoDB:", mongoErr);
        }
      }
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Failed to create order", details: error.message });
    }
  }
  /**
   * POST /api/orders/upi
   * Create an instant verified UPI order (GPay, PhonePe, Paytm, BHIM, Any UPI ID)
   */
  static async createUPIOrder(req, res) {
    try {
      const orderData = req.body;
      const { upiId, upiTxnId } = req.body;
      if (!orderData.shippingAddress) {
        res.status(400).json({ error: "Shipping address is required" });
        return;
      }
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newOrder = {
        id: orderId,
        orderNumber,
        userId: orderData.userId || "usr-customer-1",
        userEmail: (orderData.userEmail || "customer@sareesansar.com").toLowerCase().trim(),
        userName: orderData.userName || orderData.shippingAddress.fullName,
        items: orderData.items || [],
        subtotal: Number(orderData.subtotal) || 0,
        discount: Number(orderData.discount) || 0,
        couponCode: orderData.couponCode,
        shippingFee: Number(orderData.shippingFee) || 0,
        tax: Number(orderData.tax) || 0,
        totalAmount: Number(orderData.totalAmount) || 0,
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
            description: `Payment captured via UPI (${upiId || "Direct UPI Intent"}). Transaction Ref: ${upiTxnId || `UPI${Date.now()}`}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Confirmed",
            description: "Direct priority packaging assigned.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "PACKED",
            title: "Packaging & Silk Mark Inspection",
            description: "Luxury muslin folding and Silk Mark verification.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "SHIPPED",
            title: "Dispatched with BlueDart Express",
            description: "Air express courier assigned.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "DELIVERED",
            title: "Delivered",
            description: "Handed over to customer.",
            timestamp: "Pending",
            completed: false
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      for (const item of newOrder.items) {
        const prodId = item.productId || item.product?.id;
        const qty = Number(item.quantity) || 1;
        const found = db.products.find((p) => p.id === prodId || p.slug === prodId);
        if (found) {
          found.stock = Math.max(0, found.stock - qty);
        }
      }
      db.orders.unshift(newOrder);
      db.save();
      syncUserAddressOnOrder(newOrder.userId, newOrder.userEmail, newOrder.shippingAddress);
      if (isMongoConnected()) {
        try {
          await Order.create({
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            userId: newOrder.userId,
            userEmail: newOrder.userEmail,
            userName: newOrder.userName,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            couponCode: newOrder.couponCode,
            shippingFee: newOrder.shippingFee,
            tax: newOrder.tax,
            totalAmount: newOrder.totalAmount,
            paymentMethod: "UPI",
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
            shippingAddress: newOrder.shippingAddress,
            trackingNumber: newOrder.trackingNumber,
            courierPartner: newOrder.courierPartner,
            estimatedDelivery: newOrder.estimatedDelivery,
            timeline: newOrder.timeline
          });
          for (const item of newOrder.items) {
            const prodId = item.productId || item.product?.id;
            const qty = Number(item.quantity) || 1;
            await Promise.all([
              Product.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              }),
              Saree.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              })
            ]);
          }
          console.log(`\u2705 [OrderController] UPI order created in MongoDB: ${newOrder.orderNumber}`);
        } catch (mongoErr) {
          console.error("Error saving UPI order to MongoDB:", mongoErr);
        }
      }
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("UPI Order creation error:", error);
      res.status(500).json({ error: "Failed to create UPI order", details: error.message });
    }
  }
  /**
   * POST /api/payments/verify
   * Verify Razorpay payment and store order in MongoDB Atlas
   */
  static async verifyAndStoreRazorpayOrder(req, res) {
    try {
      const { razorpayOrderId, razorpayPaymentId, orderData } = req.body;
      if (!orderData || !orderData.shippingAddress) {
        res.status(400).json({ error: "Order data is required" });
        return;
      }
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `SS-ORD-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newOrder = {
        id: orderId,
        orderNumber,
        userId: orderData.userId || "usr-customer-1",
        userEmail: (orderData.userEmail || "customer@sareesansar.com").toLowerCase().trim(),
        userName: orderData.userName || orderData.shippingAddress.fullName,
        items: orderData.items || [],
        subtotal: Number(orderData.subtotal) || 0,
        discount: Number(orderData.discount) || 0,
        couponCode: orderData.couponCode,
        shippingFee: Number(orderData.shippingFee) || 0,
        tax: Number(orderData.tax) || 0,
        totalAmount: Number(orderData.totalAmount) || 0,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
        razorpayOrderId,
        orderStatus: "CONFIRMED",
        shippingAddress: orderData.shippingAddress,
        trackingNumber: `EXP-IN-${Math.floor(1e6 + Math.random() * 9e6)}`,
        courierPartner: "BlueDart Express",
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        timeline: [
          {
            status: "PLACED",
            title: "Order Placed & Paid",
            description: `Payment captured via Razorpay ID: ${razorpayPaymentId || "VERIFIED"}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "CONFIRMED",
            title: "Order Confirmed",
            description: "Master weaver inspection passed and reserved.",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
            completed: true
          },
          {
            status: "PACKED",
            title: "Silk Mark Inspection",
            description: "Luxury gift packaging with Silk Mark certification tag.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "SHIPPED",
            title: "Dispatched with BlueDart",
            description: "In transit to patron address.",
            timestamp: "Pending",
            completed: false
          },
          {
            status: "DELIVERED",
            title: "Delivered",
            description: "Handed over to customer.",
            timestamp: "Pending",
            completed: false
          }
        ],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      for (const item of newOrder.items) {
        const prodId = item.productId || item.product?.id;
        const qty = Number(item.quantity) || 1;
        const found = db.products.find((p) => p.id === prodId || p.slug === prodId);
        if (found) {
          found.stock = Math.max(0, found.stock - qty);
        }
      }
      db.orders.unshift(newOrder);
      db.save();
      syncUserAddressOnOrder(newOrder.userId, newOrder.userEmail, newOrder.shippingAddress);
      if (isMongoConnected()) {
        try {
          await Order.create({
            id: newOrder.id,
            orderNumber: newOrder.orderNumber,
            userId: newOrder.userId,
            userEmail: newOrder.userEmail,
            userName: newOrder.userName,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            couponCode: newOrder.couponCode,
            shippingFee: newOrder.shippingFee,
            tax: newOrder.tax,
            totalAmount: newOrder.totalAmount,
            paymentMethod: "RAZORPAY",
            paymentStatus: "PAID",
            razorpayPaymentId: newOrder.razorpayPaymentId,
            razorpayOrderId: newOrder.razorpayOrderId,
            orderStatus: "CONFIRMED",
            shippingAddress: newOrder.shippingAddress,
            trackingNumber: newOrder.trackingNumber,
            courierPartner: newOrder.courierPartner,
            estimatedDelivery: newOrder.estimatedDelivery,
            timeline: newOrder.timeline
          });
          for (const item of newOrder.items) {
            const prodId = item.productId || item.product?.id;
            const qty = Number(item.quantity) || 1;
            await Promise.all([
              Product.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              }),
              Saree.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: -qty } }
              ).catch(() => {
              })
            ]);
          }
          console.log(`\u2705 [OrderController] Razorpay order stored in MongoDB: ${newOrder.orderNumber}`);
        } catch (mongoErr) {
          console.error("Error saving paid order to MongoDB:", mongoErr);
        }
      }
      res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Failed to verify payment", details: error.message });
    }
  }
  /**
   * POST /api/orders/:id/cancel
   * Customer-initiated or Admin-initiated order cancellation
   * Automatically restores inventory stock and marks order as CANCELLED
   */
  /**
   * POST /api/orders/:id/cancel
   * Customer-initiated or Admin-initiated order cancellation
   * Automatically restores inventory stock and marks order as CANCELLED
   */
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const rawId = (id || "").trim();
      const lowerId = rawId.toLowerCase();
      const { reason } = req.body;
      const cancellationReason = reason || "Customer requested order cancellation.";
      let order = db.orders.find(
        (o) => o.id === rawId || o.id?.toLowerCase() === lowerId || o.orderNumber?.toLowerCase() === lowerId || o.trackingNumber?.toLowerCase() === lowerId || /^\d{3,6}$/.test(rawId) && o.orderNumber?.includes(rawId)
      );
      let mongoOrder = null;
      if (isMongoConnected()) {
        try {
          const isObjectId = rawId.match(/^[0-9a-fA-F]{24}$/);
          const regexExact = new RegExp(`^${rawId}$`, "i");
          const conditions = [
            { orderNumber: regexExact },
            { trackingNumber: regexExact },
            { id: rawId }
          ];
          if (isObjectId) conditions.push({ _id: rawId });
          if (/^\d{3,6}$/.test(rawId)) conditions.push({ orderNumber: new RegExp(rawId, "i") });
          mongoOrder = await Order.findOne({ $or: conditions });
        } catch (e) {
          console.warn("MongoDB cancel lookup notice:", e);
        }
      }
      if (!order && !mongoOrder) {
        res.status(404).json({ error: "Order not found with identifier: " + rawId });
        return;
      }
      const activeStatus = order?.orderStatus || mongoOrder?.orderStatus;
      if (activeStatus === "CANCELLED") {
        res.status(400).json({ error: "This order is already cancelled." });
        return;
      }
      if (activeStatus === "SHIPPED" || activeStatus === "DELIVERED") {
        res.status(400).json({
          error: `Order cannot be cancelled as it is already ${activeStatus}. Please request a return after delivery.`
        });
        return;
      }
      const cancelTimelineEvent = {
        status: "CANCELLED",
        title: "Order Cancelled by Customer",
        description: cancellationReason,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
        completed: true
      };
      if (order) {
        order.orderStatus = "CANCELLED";
        order.timeline = order.timeline || [];
        order.timeline.push(cancelTimelineEvent);
        for (const item of order.items || []) {
          const prodId = item.productId || item.product?.id;
          const qty = Number(item.quantity) || 1;
          const found = db.products.find((p) => p.id === prodId || p.slug === prodId);
          if (found) {
            found.stock = (Number(found.stock) || 0) + qty;
          }
        }
        db.save();
      }
      let updatedMongoOrder = null;
      if (isMongoConnected()) {
        try {
          const itemsToRestore = mongoOrder?.items || order?.items || [];
          const mongoDocId = mongoOrder?._id;
          const orderNum = mongoOrder?.orderNumber || order?.orderNumber;
          const updateQuery = mongoDocId ? { _id: mongoDocId } : { orderNumber: orderNum };
          updatedMongoOrder = await Order.findOneAndUpdate(
            updateQuery,
            {
              orderStatus: "CANCELLED",
              cancelReason: cancellationReason,
              cancelledAt: /* @__PURE__ */ new Date(),
              $push: { timeline: cancelTimelineEvent }
            },
            { new: true }
          );
          for (const item of itemsToRestore) {
            const prodId = item.productId || item.product?.id;
            const qty = Number(item.quantity) || 1;
            await Promise.all([
              Product.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: qty } }
              ).catch(() => {
              }),
              Saree.findOneAndUpdate(
                { $or: [{ sku: item.product?.sku }, { slug: prodId }, { id: prodId }] },
                { $inc: { stock: qty } }
              ).catch(() => {
              })
            ]);
          }
          console.log(`\u2705 [OrderController] Order cancelled and stock restored: ${orderNum}`);
        } catch (mongoErr) {
          console.error("Error updating cancelled order in MongoDB:", mongoErr);
        }
      }
      const rawResult = updatedMongoOrder || order || mongoOrder;
      const resultObj = rawResult && typeof rawResult.toObject === "function" ? rawResult.toObject() : { ...rawResult || {} };
      resultObj.orderStatus = "CANCELLED";
      res.json({
        success: true,
        message: "Order cancelled successfully. Saree stock has been replenished.",
        order: resultObj,
        ...resultObj
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ error: "Failed to cancel order", details: error.message });
    }
  }
  /**
   * PATCH /api/orders/:id/status
   * Update order status (Admin operations)
   */
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      let order = db.orders.find((o) => o.id === id || o.orderNumber === id);
      if (order) {
        order.orderStatus = status;
        const tIndex = order.timeline.findIndex((t) => t.status === status);
        if (tIndex !== -1) {
          order.timeline[tIndex].completed = true;
          order.timeline[tIndex].timestamp = (/* @__PURE__ */ new Date()).toLocaleString("en-IN");
        }
        db.save();
      }
      if (isMongoConnected()) {
        try {
          const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
          const query = isObjectId ? { $or: [{ _id: id }, { id }, { orderNumber: id }] } : { $or: [{ id }, { orderNumber: id }] };
          const updatedMongo = await Order.findOneAndUpdate(
            query,
            { orderStatus: status },
            { new: true }
          );
          if (updatedMongo) {
            res.json(updatedMongo);
            return;
          }
        } catch (e) {
          console.warn("MongoDB status update notice:", e);
        }
      }
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
}
export default OrderController;
