import { Router } from "express";
import { db } from '../db.js';
const router = Router();
router.get("/", (_req, res) => {
  res.json(db.categories);
});
router.post("/", (req, res) => {
  const { name, description, image, tagline } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const newCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: description || "Handcrafted weaving guild.",
    image: image || db.categories[0]?.image || "",
    productCount: 0,
    tagline: tagline || "Artisanal Craft"
  };
  db.categories.push(newCategory);
  db.save();
  res.status(201).json(newCategory);
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.categories = db.categories.filter((c) => c.id !== id);
  db.save();
  res.json({ success: true, message: "Category removed" });
});
export default router;
