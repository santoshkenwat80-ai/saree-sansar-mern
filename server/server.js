import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './server/routes/auth.js';
import productRoutes from './server/routes/products.js';
import sareeRoutes from './server/routes/sarees.js';
import reviewRoutes from './server/routes/reviews.js';
import categoryRoutes from './server/routes/categories.js';
import couponRoutes from './server/routes/coupons.js';
import orderRoutes from './server/routes/orders.js';
import paymentRoutes from './server/routes/payments.js';
import adminRoutes from './server/routes/admin.js';
import { connectMongoDB } from './server/config/db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB Atlas
connectMongoDB().catch(console.error);

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Endpoints

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sarees', sareeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);


app.get("/", (req, res) => {
  res.status(200).send("Saree Sansar Backend is running!");
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Saree Sansar Pure JavaScript MERN Backend',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Saree Sansar Pure JavaScript Backend running at http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
});
