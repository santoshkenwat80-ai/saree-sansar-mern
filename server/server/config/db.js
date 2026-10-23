import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Product } from '../models/Product.js';
import { Saree } from '../models/Saree.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { db } from '../db.js';
export { Saree };
let isConnected = false;
export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
export async function connectMongoDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("\u2139\uFE0F [MERN Stack] No MONGO_URI in .env. Using persistent local JSON database (data/database.json).");
    return false;
  }
  return await connectMongoDBWithUri(mongoUri, false);
}
export async function connectMongoDBWithUri(mongoUri, updateEnvFile = true) {
  if (!mongoUri || !mongoUri.trim()) {
    throw new Error("MongoDB URI cannot be empty");
  }
  const cleanUri = mongoUri.trim();
  try {
    console.log("\u23F3 [MERN Stack] Connecting to MongoDB Atlas (Database: saree_sansar)...");
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(cleanUri, {
      dbName: "saree_sansar",
      serverSelectionTimeoutMS: 8e3
    });
    isConnected = true;
    process.env.MONGO_URI = cleanUri;
    console.log("\u2705 [MERN Stack] Connected to MongoDB Atlas! Database: saree_sansar");
    if (updateEnvFile) {
      saveUriToEnv(cleanUri);
    }
    await seedMongoDBIfEmpty();
    return {
      success: true,
      dbName: "saree_sansar",
      host: mongoose.connection.host,
      message: "MongoDB Atlas connected successfully to database: saree_sansar",
      stats: await getCollectionsCounts()
    };
  } catch (error) {
    console.error("\u274C [MERN Stack] MongoDB Connection Error:", error);
    isConnected = false;
    throw new Error(error.message || "Failed to connect to MongoDB Atlas");
  }
}
export async function disconnectMongoDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  isConnected = false;
  return { success: true, message: "Disconnected from MongoDB Atlas. Now using local database." };
}
export async function getMongoDBStatus() {
  const readyState = mongoose.connection.readyState;
  const connected = isConnected && readyState === 1;
  let counts = {
    products: db.products.length,
    sarees: db.products.length,
    orders: db.orders.length,
    users: db.users.length,
    categories: db.categories.length,
    coupons: db.coupons.length
  };
  if (connected) {
    try {
      counts = await getCollectionsCounts();
    } catch (e) {
    }
  }
  return {
    isConnected: connected,
    dbName: "saree_sansar",
    host: connected ? mongoose.connection.host : "local-json-engine",
    readyState,
    statusText: connected ? "Connected to MongoDB Atlas" : "Running on Local Persistent JSON Engine",
    activeDatabaseType: connected ? "MongoDB Atlas (Cloud)" : "Local File Database (data/database.json)",
    hasEnvUri: Boolean(process.env.MONGO_URI),
    maskedUri: maskMongoUri(process.env.MONGO_URI || ""),
    collections: counts
  };
}
async function getCollectionsCounts() {
  const [products, sarees, orders, users, categories, coupons] = await Promise.all([
    Product.countDocuments().catch(() => db.products.length),
    Saree.countDocuments().catch(() => db.products.length),
    Order.countDocuments().catch(() => db.orders.length),
    User.countDocuments().catch(() => db.users.length),
    Category.countDocuments().catch(() => db.categories.length),
    Coupon.countDocuments().catch(() => db.coupons.length)
  ]);
  return { products, sarees, orders, users, categories, coupons };
}
export async function syncAllDataToMongoDB() {
  if (!isMongoConnected()) {
    throw new Error("Please connect to MongoDB Atlas first before syncing data.");
  }
  let syncedCounts = {
    products: 0,
    sarees: 0,
    categories: 0,
    orders: 0,
    users: 0,
    coupons: 0
  };
  if (db.categories && db.categories.length > 0) {
    for (const cat of db.categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }
    syncedCounts.categories = db.categories.length;
  }
  if (db.products && db.products.length > 0) {
    for (const prod of db.products) {
      await Product.findOneAndUpdate({ sku: prod.sku }, prod, { upsert: true });
      const sareeDoc = {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercent: prod.discountPercent || 0,
        fabricType: prod.fabric || "Banarasi Silk",
        artisan: prod.artisan || "Master Weaver Heritage Guild, Varanasi Looms",
        inventoryStatus: prod.stock === 0 ? "OUT_OF_STOCK" : prod.stock <= 5 ? "LOW_STOCK" : "IN_STOCK",
        category: prod.category || "banarasi-silk",
        color: prod.color || "Crimson Maroon & Gold",
        stock: prod.stock,
        sku: prod.sku,
        images: prod.images || [],
        silkMarkCertified: true,
        zariType: "Tested Pure Gold & Silver Zari",
        blousePieceIncluded: prod.blousePieceIncluded ?? true,
        sareeLength: prod.sareeLength || "5.5 meters saree + 0.8 meter blouse",
        careInstructions: prod.careInstructions || "Dry clean only",
        specifications: prod.specifications || {}
      };
      await Saree.findOneAndUpdate({ sku: prod.sku }, sareeDoc, { upsert: true });
    }
    syncedCounts.products = db.products.length;
    syncedCounts.sarees = db.products.length;
  }
  if (db.users && db.users.length > 0) {
    for (const usr of db.users) {
      await User.findOneAndUpdate({ email: usr.email }, usr, { upsert: true });
    }
    syncedCounts.users = db.users.length;
  }
  if (db.coupons && db.coupons.length > 0) {
    for (const cpn of db.coupons) {
      await Coupon.findOneAndUpdate({ code: cpn.code }, cpn, { upsert: true });
    }
    syncedCounts.coupons = db.coupons.length;
  }
  if (db.orders && db.orders.length > 0) {
    for (const ord of db.orders) {
      await Order.findOneAndUpdate({ orderNumber: ord.orderNumber }, ord, { upsert: true });
    }
    syncedCounts.orders = db.orders.length;
  }
  return {
    success: true,
    message: "All catalog sarees, orders, patrons, and coupons synced to MongoDB Atlas!",
    syncedCounts
  };
}
async function seedMongoDBIfEmpty() {
  try {
    const [productCount, sareeCount] = await Promise.all([
      Product.countDocuments().catch(() => 0),
      Saree.countDocuments().catch(() => 0)
    ]);
    if (productCount === 0 && db.products?.length > 0) {
      console.log("\u{1F331} [MongoDB Seed] Initializing saree_sansar collections with catalog data...");
      if (db.categories?.length > 0) await Category.insertMany(db.categories);
      if (db.products?.length > 0) await Product.insertMany(db.products);
      if (db.users?.length > 0) await User.insertMany(db.users);
      if (db.coupons?.length > 0) await Coupon.insertMany(db.coupons);
      if (db.orders?.length > 0) await Order.insertMany(db.orders);
    }
    if (sareeCount === 0 && db.products?.length > 0) {
      const sareeDocs = db.products.map((p) => ({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent || 0,
        fabricType: p.fabric || "Banarasi Silk",
        artisan: p.artisan || "Master Weaver Heritage Guild, Varanasi Looms",
        inventoryStatus: p.stock === 0 ? "OUT_OF_STOCK" : p.stock <= 5 ? "LOW_STOCK" : "IN_STOCK",
        category: p.category || "banarasi-silk",
        color: p.color || "Crimson Maroon & Gold",
        stock: p.stock,
        sku: p.sku,
        images: p.images || [],
        silkMarkCertified: true,
        zariType: "Tested Pure Gold & Silver Zari",
        blousePieceIncluded: p.blousePieceIncluded ?? true,
        sareeLength: p.sareeLength || "5.5 meters saree + 0.8 meter blouse",
        careInstructions: p.careInstructions || "Dry clean only",
        specifications: p.specifications || {}
      }));
      await Saree.insertMany(sareeDocs);
      console.log(`\u2705 Seeded ${sareeDocs.length} items into MongoDB [sarees] collection`);
    }
    console.log("\u{1F389} [MongoDB Seed] Seeding complete! Database: saree_sansar is ready in Atlas.");
  } catch (err) {
    console.warn("\u26A0\uFE0F [MongoDB Seed] Automatic seeding notice:", err);
  }
}
function saveUriToEnv(uri) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
      if (envContent.includes("MONGO_URI=")) {
        envContent = envContent.replace(/#?\s*MONGO_URI=.*(\r?\n|$)/g, `MONGO_URI="${uri}"$1`);
      } else {
        envContent += `
MONGO_URI="${uri}"
`;
      }
    } else {
      envContent = `MONGO_URI="${uri}"
PORT=3000
NODE_ENV=development
`;
    }
    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log("\u{1F4BE} [Config] MONGO_URI saved to .env file successfully.");
  } catch (err) {
    console.warn("Could not write to .env file:", err);
  }
}
function maskMongoUri(uri) {
  if (!uri) return "";
  try {
    return uri.replace(/:([^@]+)@/, ":\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022@");
  } catch {
    return uri;
  }
}
