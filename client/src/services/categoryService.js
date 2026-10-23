import apiClient from "./api";
import { INITIAL_CATEGORIES } from "./mockData";
const LOCAL_CATEGORIES_KEY = "saree_sansar_categories_db";
const getStoredCategories = () => {
  try {
    const data = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed reading categories from storage", e);
  }
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
};
const saveStoredCategories = (cats) => {
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(cats));
};
export const categoryService = {
  async getCategories() {
    try {
      const response = await apiClient.get("/categories");
      return response.data;
    } catch {
      return getStoredCategories();
    }
  },
  async addCategory(categoryData) {
    try {
      const res = await apiClient.post("/categories", categoryData);
      return res.data;
    } catch {
      const cats = getStoredCategories();
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryData.name || "New Collection",
        slug: (categoryData.name || "collection").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: categoryData.description || "Exclusive ethnic handloom weave.",
        image: categoryData.image || cats[0].image,
        productCount: 0,
        tagline: categoryData.tagline || "Artisanal Handcraft"
      };
      cats.push(newCat);
      saveStoredCategories(cats);
      return newCat;
    }
  },
  async deleteCategory(id) {
    try {
      await apiClient.delete(`/categories/${id}`);
      return true;
    } catch {
      const cats = getStoredCategories();
      const filtered = cats.filter((c) => c.id !== id);
      saveStoredCategories(filtered);
      return true;
    }
  }
};
