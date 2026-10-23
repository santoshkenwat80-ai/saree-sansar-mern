import mongoose, { Schema } from "mongoose";
const OrderItemSchema = new Schema({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  product: { type: Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true, min: 1 }
});
const TimelineSchema = new Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const OrderSchema = new Schema(
  {
    id: {
      type: String,
      index: true,
      default: () => `ord-${Date.now()}`
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      trim: true
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "COD", "UPI"],
      required: true,
      default: "COD"
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED", "REFUNDED"],
      required: true,
      default: "PENDING"
    },
    razorpayPaymentId: {
      type: String,
      trim: true
    },
    razorpayOrderId: {
      type: String,
      trim: true
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
      index: true
    },
    shippingAddress: {
      type: Schema.Types.Mixed,
      required: true
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    courierPartner: {
      type: String,
      default: "BlueDart Express"
    },
    estimatedDelivery: {
      type: String
    },
    cancelReason: {
      type: String
    },
    cancelledAt: {
      type: Date
    },
    timeline: {
      type: [TimelineSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        if (!ret.id && ret._id) ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
