import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { Loader } from "../../components/common/Loader";
export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    categoryService.getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);
  if (loading) return <Loader message="Loading heritage categories..." />;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
          Weaving Guilds of India
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-2">
          Explore Saree Traditions
        </h1>
        <p className="text-sm text-stone-600 mt-3 leading-relaxed">
          From North to South, discover the glorious spectrum of handloom sarees that have adorned Indian royalty for generations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => <div
    key={cat.id}
    className="group bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
  >
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
              <img
    src={cat.image}
    alt={cat.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    referrerPolicy="no-referrer"
  />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="text-[11px] font-semibold text-[#f2ce6e] tracking-wider uppercase">
                    {cat.tagline || "Artisanal Handloom"}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">
                  {cat.productCount} Handwoven Designs
                </span>
                <Link
    to={`/products?category=${cat.slug}`}
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b1426] hover:text-[#881930] group-hover:translate-x-0.5 transition-transform"
  >
                  <span>Explore Guild</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
