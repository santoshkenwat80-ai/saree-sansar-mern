import { useState, useEffect } from "react";
import { Search, AlertTriangle, Check, Plus, Minus } from "lucide-react";
import { productService } from "../../services/productService";
import { formatINR } from "../../utils/currency";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";
export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const loadProducts = () => {
    setLoading(true);
    productService.getProducts().then(setProducts).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadProducts();
  }, []);
  const handleStockAdjust = async (id, delta) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    await productService.updateProduct(id, { stock: newStock });
    setProducts(
      (prev) => prev.map((p) => p.id === id ? { ...p, stock: newStock } : p)
    );
    toast.success(`Updated stock for ${target.sku}`);
  };
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === "low") return matchSearch && p.stock <= 5;
    if (filterStatus === "healthy") return matchSearch && p.stock > 5;
    return matchSearch;
  });
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Stock &amp; Inventory Replenishment
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time weaver loom tracking, SKU units, and low inventory safeguards
          </p>
        </div>
      </div>

      {
    /* Filter and Search */
  }
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
    type="text"
    placeholder="Search SKU or saree title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md text-xs self-start sm:self-auto">
          <button
    onClick={() => setFilterStatus("all")}
    className={`px-3 py-1.5 rounded transition-colors ${filterStatus === "all" ? "bg-white font-semibold text-stone-900 shadow-xs" : "text-stone-600"}`}
  >
            All Items ({products.length})
          </button>
          <button
    onClick={() => setFilterStatus("low")}
    className={`px-3 py-1.5 rounded transition-colors ${filterStatus === "low" ? "bg-white font-semibold text-amber-800 shadow-xs" : "text-stone-600"}`}
  >
            Low Stock (&le; 5)
          </button>
          <button
    onClick={() => setFilterStatus("healthy")}
    className={`px-3 py-1.5 rounded transition-colors ${filterStatus === "healthy" ? "bg-white font-semibold text-emerald-800 shadow-xs" : "text-stone-600"}`}
  >
            Healthy Stock
          </button>
        </div>
      </div>

      {
    /* Table */
  }
      {loading ? <Loader message="Reading warehouse stock levels..." /> : <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">SKU Code</th>
                  <th className="px-5 py-3 font-semibold">Saree Name</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Unit Price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-center">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {item.sku}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
    src={item.images[0]}
    alt={item.name}
    className="w-10 h-14 object-cover rounded bg-stone-100 border border-stone-200 shrink-0"
  />
                        <span className="font-semibold text-stone-900 max-w-xs truncate block">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{item.fabric}</td>
                    <td className="px-5 py-3.5 font-mono font-medium text-stone-900">
                      {formatINR(item.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.stock === 0 ? <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                          Out of Stock
                        </span> : item.stock <= 5 ? <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock ({item.stock})
                        </span> : <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <Check className="w-3 h-3" />
                          In Stock ({item.stock})
                        </span>}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center border border-stone-300 rounded-md overflow-hidden bg-white">
                        <button
    onClick={() => handleStockAdjust(item.id, -1)}
    disabled={item.stock <= 0}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
    title="Decrease 1 unit"
  >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-mono font-bold text-stone-900 text-xs">
                          {item.stock}
                        </span>
                        <button
    onClick={() => handleStockAdjust(item.id, 1)}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 cursor-pointer"
    title="Increase 1 unit"
  >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
