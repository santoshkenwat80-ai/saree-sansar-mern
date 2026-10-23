import { Router } from "express";
import { OrderController } from '../controllers/OrderController.js';
const router = Router();
router.post("/create-razorpay-order", (req, res) => {
  const { amount } = req.body;
  const numAmount = Number(amount) || 1e3;
  const razorpayOrderId = `order_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  const keyId = process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_saree_sansar_dummy";
  res.json({
    razorpayOrderId,
    keyId,
    amount: Math.round(numAmount * 100),
    // in paise
    currency: "INR"
  });
});
router.post("/verify", OrderController.verifyAndStoreRazorpayOrder);
export default router;
