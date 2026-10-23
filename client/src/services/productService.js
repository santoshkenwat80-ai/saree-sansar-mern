import apiClient from "./api";
import { INITIAL_PRODUCTS } from "./mockData";
const LOCAL_PRODUCTS_KEY = "saree_sansar_products_db";
const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed reading products from storage", e);
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};
const saveStoredProducts = (products) => {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
};
export const productService = {
  async getProducts(params) {
    try {
      const response = await apiClient.get("/products", { params });
      return response.data.products || response.data;
    } catch {
      let products = getStoredProducts();
      if (params?.category && params.category !== "all") {
        products = products.filter(
          (p) => p.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      if (params?.search) {
        const query = params.search.toLowerCase().trim();
        products = products.filter(
          (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.fabric.toLowerCase().includes(query) || p.color.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query) || p.weavingTechnique?.toLowerCase().includes(query) || p.specifications?.Weave?.toLowerCase().includes(query) || p.artisan?.toLowerCase().includes(query)
        );
      }
      if (params?.weavingTechnique && params.weavingTechnique !== "all") {
        const wt = params.weavingTechnique.toLowerCase().trim();
        products = products.filter(
          (p) => p.weavingTechnique?.toLowerCase().includes(wt) || p.specifications?.Weave?.toLowerCase().includes(wt) || p.description?.toLowerCase().includes(wt)
        );
      }
      if (params?.artisan && params.artisan !== "all") {
        const art = params.artisan.toLowerCase().trim();
        products = products.filter(
          (p) => p.artisan?.toLowerCase().includes(art) || p.specifications?.Artisan?.toLowerCase().includes(art) || p.specifications?.Origin?.toLowerCase().includes(art)
        );
      }
      if (params?.fabric && params.fabric !== "all") {
        products = products.filter((p) => p.fabric === params.fabric);
      }
      if (params?.occasion && params.occasion !== "all") {
        products = products.filter((p) => p.occasion === params.occasion);
      }
      if (params?.minPrice !== void 0) {
        products = products.filter((p) => p.price >= params.minPrice);
      }
      if (params?.maxPrice !== void 0) {
        products = products.filter((p) => p.price <= params.maxPrice);
      }
      if (params?.inStockOnly) {
        products = products.filter((p) => p.stock > 0);
      }
      if (params?.sortBy) {
        switch (params.sortBy) {
          case "price-asc":
            products.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            products.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            products.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            products.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          case "popular":
          default:
            products.sort((a, b) => b.reviewsCount - a.reviewsCount);
            break;
        }
      }
      return products;
    }
  },
  async getProductByIdOrSlug(idOrSlug) {
    try {
      const response = await apiClient.get(`/products/${idOrSlug}`);
      return response.data;
    } catch {
      const products = getStoredProducts();
      return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },
  async createProduct(productData) {
    try {
      const res = await apiClient.post("/products", productData);
      return res.data;
    } catch {
      const products = getStoredProducts();
      const newProduct = {
        id: `prod-${Date.now()}`,
        name: productData.name || "Handcrafted Saree",
        slug: (productData.name || "saree").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        price: Number(productData.price) || 9999,
        originalPrice: Number(productData.originalPrice) || Number(productData.price || 9999) * 1.25,
        discountPercent: Math.round(
          (Number(productData.originalPrice || 12e3) - Number(productData.price || 9999)) / Number(productData.originalPrice || 12e3) * 100
        ),
        description: productData.description || "Pure authentic Indian saree.",
        category: productData.category || "banarasi-silk",
        fabric: productData.fabric || "Banarasi Silk",
        color: productData.color || "Royal Maroon",
        occasion: productData.occasion || "Festive",
        stock: Number(productData.stock) || 10,
        sku: productData.sku || `SS-NEW-${Math.floor(100 + Math.random() * 900)}`,
        images: productData.images && productData.images.length > 0 ? productData.images : [INITIAL_PRODUCTS[0].images[0]],
        rating: 5,
        reviewsCount: 1,
        isFeatured: Boolean(productData.isFeatured),
        isBestSeller: Boolean(productData.isBestSeller),
        isNewArrival: true,
        blousePieceIncluded: productData.blousePieceIncluded ?? true,
        sareeLength: "5.5 meters saree + 0.8 meter blouse",
        careInstructions: "Dry clean only",
        specifications: productData.specifications || {
          Weave: "Handloom",
          Origin: "Varanasi"
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      products.unshift(newProduct);
      saveStoredProducts(products);
      return newProduct;
    }
  },
  async updateProduct(id, updates) {
    try {
      const res = await apiClient.put(`/products/${id}`, updates);
      return res.data;
    } catch {
      const products = getStoredProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Product not found");
      const updated = { ...products[index], ...updates };
      products[index] = updated;
      saveStoredProducts(products);
      return updated;
    }
  },
  async deleteProduct(id) {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch {
      const products = getStoredProducts();
      const filtered = products.filter((p) => p.id !== id);
      saveStoredProducts(filtered);
      return true;
    }
  }
};
