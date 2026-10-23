import { Router } from "express";
import { db } from '../db.js';
import { Saree } from '../models/Saree.js';
import { Product } from '../models/Product.js';
import { isMongoConnected } from '../config/db.js';
const router = Router();
router.get("/", async (req, res) => {
  const {
    category,
    search,
    fabric,
    occasion,
    minPrice,
    maxPrice,
    sortBy,
    inStockOnly,
    weavingTechnique,
    technique,
    artisan
  } = req.query;
  let list = [...db.products];
  if (category && category !== "all") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.color.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.weavingTechnique?.toLowerCase().includes(q) || p.specifications?.Weave?.toLowerCase().includes(q) || p.artisan?.toLowerCase().includes(q) || p.specifications?.Origin?.toLowerCase().includes(q)
    );
  }
  const targetTechnique = weavingTechnique || technique;
  if (targetTechnique && targetTechnique !== "all") {
    const tq = targetTechnique.toLowerCase().trim();
    list = list.filter(
      (p) => p.weavingTechnique?.toLowerCase().includes(tq) || p.specifications?.Weave?.toLowerCase().includes(tq) || p.description?.toLowerCase().includes(tq)
    );
  }
  if (artisan && artisan !== "all") {
    const art = artisan.toLowerCase().trim();
    list = list.filter(
      (p) => p.artisan?.toLowerCase().includes(art) || p.specifications?.Artisan?.toLowerCase().includes(art) || p.specifications?.Origin?.toLowerCase().includes(art) || p.description?.toLowerCase().includes(art)
    );
  }
  if (fabric && fabric !== "all") {
    list = list.filter((p) => p.fabric.toLowerCase() === fabric.toLowerCase());
  }
  if (occasion && occasion !== "all") {
    list = list.filter((p) => p.occasion.toLowerCase() === occasion.toLowerCase());
  }
  if (minPrice !== void 0) {
    list = list.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice !== void 0) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }
  if (inStockOnly === "true") {
    list = list.filter((p) => p.stock > 0);
  }
  if (sortBy) {
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "popular":
      default:
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }
  }
  res.json(list);
});
router.get("/:slug", (req, res) => {
  const { slug } = req.params;
  const product = db.products.find((p) => p.slug === slug || p.id === slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});
router.post("/", async (req, res) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(400).json({ error: "Name and price are required" });
  }
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price: Number(data.price),
    originalPrice: Number(data.originalPrice) || Number(data.price) * 1.25,
    discountPercent: data.originalPrice ? Math.round((Number(data.originalPrice) - Number(data.price)) / Number(data.originalPrice) * 100) : 20,
    description: data.description || "Authentic handloom saree crafted by master weavers.",
    category: data.category || "banarasi-silk",
    fabric: data.fabric || data.fabricType || "Banarasi Silk",
    color: data.color || "Royal Crimson",
    occasion: data.occasion || "Festive",
    stock: Number(data.stock) || 10,
    sku: data.sku || `SS-WEAVE-${Math.floor(100 + Math.random() * 900)}`,
    images: data.images && data.images.length > 0 ? data.images : [db.products[0]?.images[0] || ""],
    rating: 5,
    reviewsCount: 1,
    isFeatured: Boolean(data.isFeatured),
    isBestSeller: Boolean(data.isBestSeller),
    isNewArrival: true,
    blousePieceIncluded: data.blousePieceIncluded ?? true,
    sareeLength: "5.5 meters saree + 0.8 meter blouse",
    careInstructions: "Dry clean only. Store in muslin.",
    specifications: data.specifications || {
      Weave: "Handloom",
      Origin: "Varanasi"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.products.unshift(newProduct);
  db.save();
  if (isMongoConnected()) {
    try {
      const sareeDoc = {
        name: newProduct.name,
        slug: newProduct.slug,
        description: newProduct.description,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        discountPercent: newProduct.discountPercent,
        fabricType: newProduct.fabric,
        artisan: data.artisan || "Heritage Handloom Guild, Varanasi Looms",
        inventoryStatus: newProduct.stock === 0 ? "OUT_OF_STOCK" : newProduct.stock <= 5 ? "LOW_STOCK" : "IN_STOCK",
        category: newProduct.category,
        color: newProduct.color,
        stock: newProduct.stock,
        sku: newProduct.sku,
        images: newProduct.images,
        silkMarkCertified: true,
        zariType: "Tested Pure Gold & Silver Zari",
        blousePieceIncluded: newProduct.blousePieceIncluded,
        sareeLength: newProduct.sareeLength,
        careInstructions: newProduct.careInstructions
      };
      await Promise.all([
        Saree.findOneAndUpdate({ sku: newProduct.sku }, sareeDoc, { upsert: true }),
        Product.findOneAndUpdate({ sku: newProduct.sku }, newProduct, { upsert: true })
      ]);
      console.log(`\u2705 [MongoDB Atlas] Saree saved to [sarees] collection: ${newProduct.name}`);
    } catch (mongoErr) {
      console.error("MongoDB Saree save notice:", mongoErr);
    }
  }
  res.status(201).json(newProduct);
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  const updated = {
    ...db.products[index],
    ...req.body,
    id
    // protect id
  };
  db.products[index] = updated;
  db.save();
  if (isMongoConnected()) {
    try {
      const sareeDoc = {
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        price: updated.price,
        originalPrice: updated.originalPrice,
        discountPercent: updated.discountPercent || 0,
        fabricType: updated.fabric || updated.fabricType || "Banarasi Silk",
        artisan: req.body.artisan || "Heritage Handloom Guild, Varanasi Looms",
        inventoryStatus: updated.stock === 0 ? "OUT_OF_STOCK" : updated.stock <= 5 ? "LOW_STOCK" : "IN_STOCK",
        category: updated.category,
        color: updated.color,
        stock: updated.stock,
        sku: updated.sku,
        images: updated.images
      };
      await Promise.all([
        Saree.findOneAndUpdate({ sku: updated.sku }, sareeDoc, { upsert: true }),
        Product.findOneAndUpdate({ sku: updated.sku }, updated, { upsert: true })
      ]);
    } catch (e) {
      console.warn("MongoDB update notice:", e);
    }
  }
  res.json(updated);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const target = db.products.find((p) => p.id === id);
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ error: "Product not found" });
  }
  db.save();
  if (target && isMongoConnected()) {
    try {
      await Promise.all([
        Saree.deleteOne({ sku: target.sku }),
        Product.deleteOne({ sku: target.sku })
      ]);
    } catch (e) {
      console.warn("MongoDB delete notice:", e);
    }
  }
  res.json({ success: true, message: "Product deleted from catalogue and MongoDB" });
});
export default router;
