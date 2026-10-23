import { useState, useEffect } from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";
export const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const loadCategories = () => {
    setLoading(true);
    categoryService.getCategories().then(setCategories).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadCategories();
  }, []);
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    await categoryService.addCategory({ name, tagline, description });
    toast.success("Category added");
    setIsModalOpen(false);
    setName("");
    setTagline("");
    setDescription("");
    loadCategories();
  };
  const handleDelete = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted");
      loadCategories();
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Weaving Guilds &amp; Categories
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize saree taxonomy, craft regions, and regional taglines
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Weaving Guild
        </Button>
      </div>

      {loading ? <Loader message="Loading categories..." /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => <div
    key={c.id}
    className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
  >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#881930]" />
                    <h3 className="font-serif font-bold text-base text-stone-900">{c.name}</h3>
                  </div>
                  <button
    onClick={() => handleDelete(c.id, c.name)}
    className="text-stone-400 hover:text-rose-600 p-1"
    title="Delete Category"
  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#a07817] font-semibold uppercase tracking-wider">
                  {c.tagline || "Heirloom Handloom"}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed">{c.description}</p>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono">Slug: {c.slug}</span>
                <span className="font-semibold text-stone-900">{c.productCount} Designs</span>
              </div>
            </div>)}
        </div>}

      {
    /* Add Modal */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="Add Weaving Guild / Category"
    maxWidth="md"
  >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
    label="Guild / Category Name"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="e.g. Patola &amp; Ikat"
  />
          <Input
    label="Tagline"
    value={tagline}
    onChange={(e) => setTagline(e.target.value)}
    placeholder="e.g. Sacred Double Ikat of Gujarat"
  />
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
    rows={3}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
    placeholder="Historical origin and motifs..."
  />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Guild</Button>
          </div>
        </form>
      </Modal>
    </div>;
};
