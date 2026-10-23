import { Saree } from '../models/Saree.js';
import { Product } from '../models/Product.js';
import { db } from '../db.js';
import { isMongoConnected } from '../config/db.js';
export class SareeController {
  /**
   * GET /api/sarees
   * Fetch all sarees with optional query filters (category, fabric, artisan, price range, search, sort)
   */
  static async getAllSarees(req, res) {
    try {
      const {
        category,
        fabric,
        fabricType,
        artisan,
        inventoryStatus,
        search,
        minPrice,
        maxPrice,
        sortBy,
        inStockOnly,
        weavingTechnique,
        technique
      } = req.query;
      if (isMongoConnected()) {
        const filter = {};
        if (category && category !== "all") {
          filter.category = new RegExp(`^${category}$`, "i");
        }
        const targetFabric2 = fabricType || fabric;
        if (targetFabric2 && targetFabric2 !== "all") {
          filter.$or = [
            { fabricType: new RegExp(targetFabric2, "i") },
            { fabric: new RegExp(targetFabric2, "i") }
          ];
        }
        const targetTechnique2 = weavingTechnique || technique;
        if (targetTechnique2 && targetTechnique2 !== "all") {
          filter.$or = [
            { weavingTechnique: new RegExp(targetTechnique2, "i") },
            { "specifications.Weave": new RegExp(targetTechnique2, "i") }
          ];
        }
        if (artisan && artisan !== "all") {
          filter.artisan = new RegExp(artisan, "i");
        }
        if (inventoryStatus && inventoryStatus !== "all") {
          filter.inventoryStatus = inventoryStatus;
        }
        if (minPrice !== void 0 || maxPrice !== void 0) {
          filter.price = {};
          if (minPrice !== void 0) filter.price.$gte = Number(minPrice);
          if (maxPrice !== void 0) filter.price.$lte = Number(maxPrice);
        }
        if (inStockOnly === "true") {
          filter.stock = { $gt: 0 };
        }
        if (search && search.trim()) {
          const searchRegex = new RegExp(search.trim(), "i");
          filter.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { fabricType: searchRegex },
            { artisan: searchRegex },
            { color: searchRegex },
            { sku: searchRegex }
          ];
        }
        const sortOptions = {};
        switch (sortBy) {
          case "price-asc":
            sortOptions.price = 1;
            break;
          case "price-desc":
            sortOptions.price = -1;
            break;
          case "rating":
            sortOptions.rating = -1;
            break;
          case "newest":
            sortOptions.createdAt = -1;
            break;
          case "popular":
          default:
            sortOptions.isBestSeller = -1;
            sortOptions.createdAt = -1;
            break;
        }
        const sarees = await Saree.find(filter).sort(sortOptions);
        if (sarees && sarees.length > 0) {
          res.json(sarees);
          return;
        }
      }
      let list = [...db.products];
      if (category && category !== "all") {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      const targetFabric = fabricType || fabric;
      if (targetFabric && targetFabric !== "all") {
        list = list.filter((p) => p.fabric.toLowerCase().includes(targetFabric.toLowerCase()));
      }
      if (minPrice !== void 0) {
        list = list.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice !== void 0) {
        list = list.filter((p) => p.price <= Number(maxPrice));
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
      if (inStockOnly === "true") {
        list = list.filter((p) => p.stock > 0);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.color.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.weavingTechnique?.toLowerCase().includes(q) || p.specifications?.Weave?.toLowerCase().includes(q) || p.artisan?.toLowerCase().includes(q)
        );
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
          default:
            list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
            break;
        }
      }
      res.json(list);
    } catch (error) {
      console.error("Error fetching sarees:", error);
      res.status(500).json({ error: "Failed to retrieve sarees", details: error.message });
    }
  }
  /**
   * GET /api/sarees/:idOrSlug
   * Fetch single saree by MongoDB _id, slug, or SKU
   */
  static async getSareeById(req, res) {
    try {
      const { idOrSlug } = req.params;
      if (isMongoConnected()) {
        const isMongoId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
        const query = isMongoId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }] } : { $or: [{ slug: idOrSlug }, { sku: idOrSlug }] };
        const saree = await Saree.findOne(query);
        if (saree) {
          res.json(saree);
          return;
        }
      }
      const localSaree = db.products.find(
        (p) => p.slug === idOrSlug || p.id === idOrSlug || p.sku === idOrSlug
      );
      if (!localSaree) {
        res.status(404).json({ error: "Saree not found" });
        return;
      }
      res.json(localSaree);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve saree details", details: error.message });
    }
  }
  /**
   * POST /api/sarees
   * Add a new Saree document into MongoDB Atlas using Saree Mongoose model
   */
  static async createSaree(req, res) {
    try {
      const {
        name,
        description,
        price,
        originalPrice,
        fabricType,
        fabric,
        artisan,
        inventoryStatus,
        category,
        color,
        stock,
        sku,
        images,
        blousePieceIncluded,
        sareeLength,
        careInstructions,
        isFeatured,
        isBestSeller,
        isNewArrival
      } = req.body;
      if (!name || !price) {
        res.status(400).json({ error: "Saree name and price are required" });
        return;
      }
      const finalPrice = Number(price);
      const finalOriginalPrice = Number(originalPrice) || Math.round(finalPrice * 1.25);
      const finalDiscount = finalOriginalPrice > finalPrice ? Math.round((finalOriginalPrice - finalPrice) / finalOriginalPrice * 100) : 0;
      const finalStock = stock !== void 0 ? Number(stock) : 10;
      const computedInventoryStatus = inventoryStatus || (finalStock === 0 ? "OUT_OF_STOCK" : finalStock <= 5 ? "LOW_STOCK" : "IN_STOCK");
      const finalSku = sku || `SS-${Date.now().toString().slice(-6)}`;
      const finalSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const sareePayload = {
        name: name.trim(),
        slug: finalSlug,
        description: description || "Handloom pure silk saree crafted by master weavers.",
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        discountPercent: finalDiscount,
        fabricType: fabricType || fabric || "Banarasi Silk",
        artisan: artisan || "Heritage Handloom Guild, Varanasi Looms",
        inventoryStatus: computedInventoryStatus,
        category: category || "banarasi-silk",
        color: color || "Royal Crimson Maroon & Gold",
        stock: finalStock,
        sku: finalSku,
        images: images && images.length > 0 ? images : ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"],
        silkMarkCertified: true,
        zariType: "Tested Pure Gold & Silver Zari",
        blousePieceIncluded: blousePieceIncluded ?? true,
        sareeLength: sareeLength || "5.5 meters saree + 0.8 meter blouse piece",
        careInstructions: careInstructions || "Dry clean only. Store in muslin cloth.",
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isNewArrival: isNewArrival ?? true,
        rating: 5,
        reviewsCount: 1
      };
      let createdDoc = null;
      if (isMongoConnected()) {
        try {
          createdDoc = await Saree.create(sareePayload);
          await Product.create({ ...sareePayload, fabric: sareePayload.fabricType }).catch(() => {
          });
          console.log(`\u2705 [SareeController] Saved to MongoDB Atlas: ${createdDoc.name}`);
        } catch (mongoErr) {
          console.error("Error saving Saree to MongoDB:", mongoErr);
        }
      }
      const localProduct = {
        id: createdDoc?._id?.toString() || `prod-${Date.now()}`,
        name: sareePayload.name,
        slug: sareePayload.slug,
        price: sareePayload.price,
        originalPrice: sareePayload.originalPrice,
        discountPercent: sareePayload.discountPercent,
        description: sareePayload.description,
        category: sareePayload.category,
        fabric: sareePayload.fabricType,
        color: sareePayload.color,
        occasion: "Bridal & Festive",
        stock: sareePayload.stock,
        sku: sareePayload.sku,
        images: sareePayload.images,
        rating: sareePayload.rating,
        reviewsCount: sareePayload.reviewsCount,
        isFeatured: sareePayload.isFeatured,
        isBestSeller: sareePayload.isBestSeller,
        isNewArrival: sareePayload.isNewArrival,
        blousePieceIncluded: sareePayload.blousePieceIncluded,
        sareeLength: sareePayload.sareeLength,
        careInstructions: sareePayload.careInstructions,
        specifications: {
          "Fabric Type": sareePayload.fabricType,
          Artisan: sareePayload.artisan,
          "Inventory Status": sareePayload.inventoryStatus
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.products.unshift(localProduct);
      db.save();
      res.status(201).json(createdDoc || localProduct);
    } catch (error) {
      console.error("Error creating Saree:", error);
      res.status(500).json({ error: "Failed to create Saree", details: error.message });
    }
  }
  /**
   * PUT /api/sarees/:idOrSlug
   * Update saree document in MongoDB
   */
  static async updateSaree(req, res) {
    try {
      const { idOrSlug } = req.params;
      const updates = req.body;
      if (updates.stock !== void 0) {
        const stockNum = Number(updates.stock);
        updates.stock = stockNum;
        if (!updates.inventoryStatus) {
          updates.inventoryStatus = stockNum === 0 ? "OUT_OF_STOCK" : stockNum <= 5 ? "LOW_STOCK" : "IN_STOCK";
        }
      }
      if (updates.fabric && !updates.fabricType) {
        updates.fabricType = updates.fabric;
      }
      let updatedDoc = null;
      if (isMongoConnected()) {
        const isMongoId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
        const query = isMongoId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }] } : { $or: [{ slug: idOrSlug }, { sku: idOrSlug }] };
        updatedDoc = await Saree.findOneAndUpdate(query, updates, {
          new: true,
          runValidators: true
        });
        await Product.findOneAndUpdate(query, updates).catch(() => {
        });
      }
      const localIndex = db.products.findIndex(
        (p) => p.id === idOrSlug || p.slug === idOrSlug || p.sku === idOrSlug
      );
      if (localIndex !== -1) {
        db.products[localIndex] = {
          ...db.products[localIndex],
          ...updates,
          fabric: updates.fabricType || updates.fabric || db.products[localIndex].fabric
        };
        db.save();
      }
      if (!updatedDoc && localIndex === -1) {
        res.status(404).json({ error: "Saree not found to update" });
        return;
      }
      res.json(updatedDoc || db.products[localIndex]);
    } catch (error) {
      console.error("Error updating Saree:", error);
      res.status(500).json({ error: "Failed to update Saree", details: error.message });
    }
  }
  /**
   * DELETE /api/sarees/:idOrSlug
   * Permanently delete a saree from MongoDB Atlas and local catalogue
   */
  static async deleteSaree(req, res) {
    try {
      const { idOrSlug } = req.params;
      let deletedDoc = null;
      if (isMongoConnected()) {
        const isMongoId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
        const query = isMongoId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }] } : { $or: [{ slug: idOrSlug }, { sku: idOrSlug }] };
        deletedDoc = await Saree.findOneAndDelete(query);
        await Product.findOneAndDelete(query).catch(() => {
        });
      }
      const initialLen = db.products.length;
      db.products = db.products.filter(
        (p) => p.id !== idOrSlug && p.slug !== idOrSlug && p.sku !== idOrSlug
      );
      db.save();
      if (!deletedDoc && db.products.length === initialLen) {
        res.status(404).json({ error: "Saree not found to delete" });
        return;
      }
      res.json({
        success: true,
        message: "Saree successfully deleted from MongoDB Atlas and catalogue",
        deletedId: idOrSlug
      });
    } catch (error) {
      console.error("Error deleting Saree:", error);
      res.status(500).json({ error: "Failed to delete Saree", details: error.message });
    }
  }
  /**
   * PATCH /api/sarees/:idOrSlug/inventory
   * Quickly update inventory status and stock units
   */
  static async updateInventory(req, res) {
    try {
      const { idOrSlug } = req.params;
      const { stock, inventoryStatus } = req.body;
      const updates = {};
      if (stock !== void 0) {
        updates.stock = Number(stock);
        if (!inventoryStatus) {
          updates.inventoryStatus = updates.stock === 0 ? "OUT_OF_STOCK" : updates.stock <= 5 ? "LOW_STOCK" : "IN_STOCK";
        }
      }
      if (inventoryStatus) {
        updates.inventoryStatus = inventoryStatus;
      }
      if (isMongoConnected()) {
        const query = { $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }] };
        const updated = await Saree.findOneAndUpdate(query, updates, { new: true });
        if (updated) {
          res.json(updated);
          return;
        }
      }
      const item = db.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
      if (item) {
        if (updates.stock !== void 0) item.stock = updates.stock;
        db.save();
        res.json(item);
        return;
      }
      res.status(404).json({ error: "Saree not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory", details: error.message });
    }
  }
}
export default SareeController;
