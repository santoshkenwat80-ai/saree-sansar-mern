import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react";
import { productService } from "../../services/productService";
import { formatINR } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";
const PRESET_IMAGES = [
  { name: "Bridal Crimson Banarasi", url: "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg" },
  { name: "Emerald Kanjivaram Gold", url: "/src/assets/images/saree_kanjivaram_gold_1791698990300.jpg" },
  { name: "Pastel Tissue Chanderi", url: "/src/assets/images/saree_chanderi_pastel_1791699001746.jpg" },
  { name: "Royal Blue Georgette Jaal", url: "/src/assets/images/saree_banarasi_blue_1791699014715.jpg" }
];
export const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "banarasi-silk",
    fabric: "Banarasi Silk",
    color: "Crimson Maroon & Gold",
    price: 14999,
    originalPrice: 19999,
    stock: 10,
    sku: "",
    description: "",
    images: [],
    isFeatured: true,
    isBestSeller: false,
    blousePieceIncluded: true
  });
  const loadProducts = () => {
    setLoading(true);
    productService.getProducts().then(setProducts).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadProducts();
  }, []);
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImageUrlInput("");
    setForm({
      name: "",
      category: "banarasi-silk",
      fabric: "Banarasi Silk",
      color: "Royal Maroon & Gold",
      price: 14999,
      originalPrice: 19999,
      stock: 8,
      sku: `SS-CAT-${Math.floor(100 + Math.random() * 900)}`,
      description: "Handcrafted master weave with certified pure tested zari and regal drape.",
      images: ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"],
      isFeatured: true,
      isBestSeller: false,
      blousePieceIncluded: true
    });
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setImageUrlInput("");
    setForm({
      name: p.name,
      category: p.category,
      fabric: p.fabric,
      color: p.color,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      sku: p.sku,
      description: p.description,
      images: p.images && p.images.length > 0 ? [...p.images] : ["/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"],
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      blousePieceIncluded: p.blousePieceIncluded
    });
    setIsModalOpen(true);
  };
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, base64]
      }));
      toast.success("Saree image uploaded successfully!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      toast.error("Please enter a valid Image URL");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput("");
    toast.success("Image URL attached!");
  };
  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
    toast.success("Image removed");
  };
  const handleSelectPreset = (presetUrl) => {
    if (form.images.includes(presetUrl)) {
      toast.error("Image already added");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, presetUrl]
    }));
    toast.success("Catalog image selected!");
  };
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from the catalogue?`)) {
      await productService.deleteProduct(id);
      toast.success("Product deleted from database");
      loadProducts();
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter product name");
      return;
    }
    if (form.images.length === 0) {
      toast.error("Please upload at least one image for the saree");
      return;
    }
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, form);
        toast.success("Product and images updated successfully");
      } else {
        await productService.createProduct(form);
        toast.success("New product with image created in database");
      }
      setIsModalOpen(false);
      loadProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Saree Catalogue &amp; Products
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Admin can add, edit, and upload product images, specifications, and inventory
          </p>
        </div>
        <Button onClick={handleOpenAddModal} size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Handloom Saree
        </Button>
      </div>

      {
    /* Filters Strip */
  }
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
    type="text"
    placeholder="Search by name, SKU, or fabric..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
        </div>
        <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#881930]"
  >
          <option value="all">All Weaving Categories</option>
          <option value="banarasi-silk">Banarasi Silk</option>
          <option value="kanjivaram-silk">Kanjivaram Silk</option>
          <option value="chanderi-organza">Chanderi &amp; Organza</option>
          <option value="georgette-chiffon">Georgette &amp; Chiffon</option>
          <option value="bridal-heritage">Bridal Heritage</option>
        </select>
      </div>

      {
    /* Products Table */
  }
      {loading ? <Loader message="Loading saree inventory..." /> : <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Saree / Photography</th>
                  <th className="px-5 py-3">Fabric &amp; Category</th>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock Units</th>
                  <th className="px-5 py-3">Badges</th>
                  <th className="px-5 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filtered.map((product) => <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    {
    /* Image & Title */
  }
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img
    src={product.images && product.images[0] ? product.images[0] : "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg"}
    alt={product.name}
    className="w-full h-full object-cover object-top"
  />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 max-w-xs truncate">
                          {product.name}
                        </p>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {product.color}
                        </span>
                      </div>
                    </td>

                    {
    /* Fabric */
  }
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{product.fabric}</p>
                      <span className="text-[10px] text-[#a07817] font-semibold uppercase">
                        {product.category}
                      </span>
                    </td>

                    {
    /* SKU */
  }
                    <td className="px-5 py-3.5 font-mono text-[11px]">
                      {product.sku}
                    </td>

                    {
    /* Price */
  }
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900 font-mono">
                        {formatINR(product.price)}
                      </p>
                      {product.originalPrice > product.price && <p className="text-[10px] text-stone-400 line-through font-mono">
                          {formatINR(product.originalPrice)}
                        </p>}
                    </td>

                    {
    /* Stock */
  }
                    <td className="px-5 py-3.5">
                      {product.stock <= 5 ? <span className="inline-flex items-center gap-1 text-amber-700 font-mono font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {product.stock} units
                        </span> : <span className="text-emerald-700 font-mono font-bold">
                          {product.stock} units
                        </span>}
                    </td>

                    {
    /* Badges */
  }
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {product.isBestSeller && <span className="px-1.5 py-0.5 bg-[#f5eedf] text-[#6b1426] rounded text-[10px] font-semibold">
                            Bestseller
                          </span>}
                        {product.isFeatured && <span className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px]">
                            Featured
                          </span>}
                      </div>
                    </td>

                    {
    /* Actions */
  }
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
    onClick={() => handleOpenEditModal(product)}
    className="p-1.5 text-stone-600 hover:text-[#6b1426] hover:bg-stone-100 rounded transition-colors"
    title="Edit Saree & Photography"
  >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
    onClick={() => handleDelete(product.id, product.name)}
    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
    title="Delete Saree"
  >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      {
    /* Add / Edit Saree Modal with Image Upload by Admin */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title={editingProduct ? "Edit Saree & Manage Images" : "Add New Handloom Saree (Admin)"}
    maxWidth="xl"
  >
        <form onSubmit={handleSubmitForm} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <Input
    label="Saree Title"
    required
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    placeholder="e.g. Royal Neelambari Banarasi Georgette Saree"
  />

          {
    /* ========================================================= */
  }
          {
    /* ADMIN IMAGE MANAGEMENT & UPLOAD SECTION                   */
  }
          {
    /* ========================================================= */
  }
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6b1426] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#881930]" />
                <span>Saree Photography (Admin Upload)</span>
              </label>
              <span className="text-[11px] text-stone-500">
                {form.images.length} Image(s) Attached
              </span>
            </div>

            {
    /* Upload Options: File Input & URL */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {
    /* Option A: Device File Upload */
  }
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  1. Upload from Computer / Device
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-stone-300 hover:border-[#881930] bg-white rounded-lg cursor-pointer text-xs font-medium text-stone-700 hover:text-[#881930] transition-colors">
                  <Upload className="w-4 h-4 text-[#881930]" />
                  <span>Choose Photo File</span>
                  <input
    type="file"
    accept="image/*"
    onChange={handleFileUpload}
    className="hidden"
  />
                </label>
              </div>

              {
    /* Option B: Direct Image URL */
  }
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  2. Or Attach Image URL / Link
                </label>
                <div className="flex gap-1.5">
                  <input
    type="url"
    placeholder="https://..."
    value={imageUrlInput}
    onChange={(e) => setImageUrlInput(e.target.value)}
    className="flex-1 px-2.5 py-1.5 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
                  <button
    type="button"
    onClick={handleAddImageUrl}
    className="px-3 py-1.5 bg-stone-800 text-white hover:bg-stone-900 rounded-md text-xs font-semibold"
  >
                    Attach
                  </button>
                </div>
              </div>
            </div>

            {
    /* Quick Catalog Presets */
  }
            <div>
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
                Quick Preset Handloom Photos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset) => <button
    key={preset.name}
    type="button"
    onClick={() => handleSelectPreset(preset.url)}
    className="px-2.5 py-1 text-[11px] bg-white hover:bg-[#f5eedf] hover:text-[#6b1426] border border-stone-200 rounded-full text-stone-600 transition-colors"
  >
                    + {preset.name}
                  </button>)}
              </div>
            </div>

            {
    /* Image Thumbnails & Preview Grid */
  }
            {form.images.length > 0 && <div className="pt-2 border-t border-stone-200">
                <span className="text-[11px] font-bold text-stone-700 block mb-2">
                  Uploaded Saree Images (Click ✕ to remove):
                </span>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((imgUrl, index) => <div
    key={index}
    className="relative group w-20 h-24 rounded-lg overflow-hidden border border-stone-300 shadow-2xs bg-white"
  >
                      <img
    src={imgUrl}
    alt={`Saree Preview ${index + 1}`}
    className="w-full h-full object-cover object-top"
  />
                      {index === 0 && <span className="absolute top-1 left-1 bg-[#6b1426] text-white text-[9px] font-bold px-1 rounded shadow-xs">
                          Cover
                        </span>}
                      <button
    type="button"
    onClick={() => handleRemoveImage(index)}
    className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 hover:bg-rose-700 transition-opacity"
    title="Remove image"
  >
                        <X className="w-3 h-3" />
                      </button>
                    </div>)}
                </div>
              </div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
    value={form.category}
    onChange={(e) => setForm({ ...form, category: e.target.value })}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#881930]"
  >
                <option value="banarasi-silk">Banarasi Silk</option>
                <option value="kanjivaram-silk">Kanjivaram Silk</option>
                <option value="chanderi-organza">Chanderi &amp; Organza</option>
                <option value="georgette-chiffon">Georgette &amp; Chiffon</option>
                <option value="bridal-heritage">Bridal Heritage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Fabric Type
              </label>
              <select
    value={form.fabric}
    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#881930]"
  >
                <option value="Banarasi Silk">Banarasi Silk</option>
                <option value="Kanjivaram Silk">Kanjivaram Silk</option>
                <option value="Chanderi">Chanderi</option>
                <option value="Georgette">Georgette</option>
                <option value="Pure Silk">Pure Silk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
    label="Selling Price (INR)"
    type="number"
    required
    value={form.price}
    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
  />
            <Input
    label="Original MRP (INR)"
    type="number"
    value={form.originalPrice}
    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
  />
            <Input
    label="Inventory Units"
    type="number"
    required
    value={form.stock}
    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
  />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
    label="SKU Code"
    value={form.sku}
    onChange={(e) => setForm({ ...form, sku: e.target.value })}
    placeholder="e.g. SS-BAN-009"
  />
            <Input
    label="Color Tone"
    value={form.color}
    onChange={(e) => setForm({ ...form, color: e.target.value })}
    placeholder="e.g. Royal Emerald Green & Gold"
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Description &amp; Weaving History
            </label>
            <textarea
    rows={3}
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
          </div>

          <div className="flex flex-wrap gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
    type="checkbox"
    checked={form.isFeatured}
    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
    className="accent-[#881930]"
  />
              <span>Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
    type="checkbox"
    checked={form.isBestSeller}
    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
    className="accent-[#881930]"
  />
              <span>Bestseller Tag</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
    type="checkbox"
    checked={form.blousePieceIncluded}
    onChange={(e) => setForm({ ...form, blousePieceIncluded: e.target.checked })}
    className="accent-[#881930]"
  />
              <span>Blouse Piece Included</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button
    type="button"
    variant="outline"
    onClick={() => setIsModalOpen(false)}
  >
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Save Saree & Images" : "Create Saree with Image"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
};
